import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, Wallet } from "lucide-react";
import TransactionsList from "@/components/TransactionsList";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = React.useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }, [navigate]);
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
        {/* Top bar */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
              <Wallet className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Expensify
              </h1>
              <p className="text-sm text-slate-500">Track your money simply</p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2 rounded-xl border-slate-200 bg-white px-4"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </header>

        <section className="mb-5">
          <p className="text-sm font-medium text-slate-500">Dashboard</p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Your money at a glance
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Review your all-time balance, income, expenses, and recent activity.
          </p>
        </section>

        {/* Transactions */}
        <section id="recent-transactions" className="pb-24">
          <TransactionsList />
        </section>
      </div>

      {/* Mobile Floating Add Button */}
      <div className="pointer-events-none fixed bottom-6 left-0 right-0 z-50 md:hidden">
        <div className="mx-auto flex max-w-5xl justify-end px-4 sm:px-6 lg:px-8">
          <Button
            onClick={() => navigate("/add-transaction")}
            size="icon"
            className="pointer-events-auto h-16 w-16 rounded-full bg-black text-white shadow-lg hover:bg-black/90"
            aria-label="Add transaction"
          >
            <Plus className="h-8 w-8" strokeWidth={2.5} />
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Home;
