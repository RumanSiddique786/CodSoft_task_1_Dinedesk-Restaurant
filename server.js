const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  // Attach Socket.io to the unified HTTP server
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Share io instance globally so Next.js API routes can emit if needed
  global.io = io;

  io.on('connection', (socket) => {
    console.log(`🔌 [Socket.io] Client connected: ${socket.id}`);

    // Join room (e.g. 'kds', 'waiter', 'order_123', 'table_T01')
    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`📡 [Socket.io] Client ${socket.id} joined room: ${room}`);
    });

    socket.on('leave_room', (room) => {
      socket.leave(room);
    });

    // 1. New Order placed -> Notify KDS, Waiters & Admin
    socket.on('order:new', (orderData) => {
      console.log(`🔔 [Socket.io] New Order: ${orderData.orderNumber || orderData.id}`);
      io.emit('order:incoming', orderData);
    });

    // 2. Order status update (e.g. Preparing -> Ready -> Served)
    socket.on('order:status_update', (data) => {
      console.log(`🔄 [Socket.io] Order status changed: ${data.orderId} -> ${data.status}`);
      io.emit('order:status_changed', data);
      io.to(`order_${data.orderId}`).emit('order:status_changed', data);
    });

    // 3. "Call Waiter" buzzer alert
    socket.on('waiter:call', (callData) => {
      console.log(`🚨 [Socket.io] Waiter called from Table ${callData.tableNumber}: ${callData.reason}`);
      io.emit('waiter:buzzer', callData);
    });

    // 4. Waiter handled/resolved call
    socket.on('waiter:call_resolved', (callId) => {
      console.log(`✅ [Socket.io] Waiter call resolved: ${callId}`);
      io.emit('waiter:call_cleared', callId);
    });

    // 5. 86'd Item availability toggle (live kitchen out-of-stock)
    socket.on('menu:toggle_availability', (itemData) => {
      console.log(`🛑 [Socket.io] Menu Item 86 toggle: ${itemData.itemId} -> ${itemData.isAvailable}`);
      io.emit('menu:availability_updated', itemData);
    });

    // 6. Table status change
    socket.on('table:update_status', (tableData) => {
      console.log(`🪑 [Socket.io] Table ${tableData.tableNumber} status -> ${tableData.status}`);
      io.emit('table:status_changed', tableData);
    });

    socket.on('disconnect', () => {
      // client disconnected
    });
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`
      ======================================================
      🍽️  DINEDESK RESTAURANT PLATFORM RUNNING
      ======================================================
      🚀 Next.js App & Socket.io Ready on http://${hostname}:${port}
      📱 Customer App:      http://${hostname}:${port}/
      🍳 Kitchen (KDS):     http://${hostname}:${port}/kds
      🛎️  Waiter Portal:     http://${hostname}:${port}/waiter
      📊 Admin Dashboard:   http://${hostname}:${port}/admin
      👑 Super Admin:       http://${hostname}:${port}/super-admin
      🔑 Fast Demo Login:   http://${hostname}:${port}/login
      ======================================================
    `);
  });
});
