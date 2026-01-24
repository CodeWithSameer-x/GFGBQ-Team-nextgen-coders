<<<<<<< HEAD
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/resources');
=======
import { Dashboard } from "@/components/dashboard";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <Dashboard />
      </main>
    </div>
  );
>>>>>>> b97d77a5d12baed8376e7925d074ce89eed883b9
}
