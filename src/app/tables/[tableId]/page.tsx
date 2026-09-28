import { redirect } from 'next/navigation';

export default function TableLandingPage({
  params,
}: {
  params: { tableId: string };
}) {
  const tableNumber = params.tableId.toUpperCase();
  redirect(`/?table=${tableNumber}&mode=dinein`);
}
