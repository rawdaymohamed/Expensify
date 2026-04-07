import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut, PlusCircle, Wallet } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white shadow-sm">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Expensify
              </h1>
              <p className="text-sm text-slate-500">Track your money simply</p>
            </div>
          </div>

          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </header>

        {/* Welcome */}
        <section className="mb-6">
          <h2 className="text-3xl font-bold text-slate-900">Welcome back 👋</h2>
          <p className="mt-2 text-slate-600">
            Start by adding a transaction to keep your expenses up to date.
          </p>
        </section>

        {/* Dashboard cards */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Card
            onClick={() => navigate("/add-transaction")}
            className="cursor-pointer border-0 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                <PlusCircle className="h-6 w-6 text-slate-900" />
              </div>

              <h3 className="text-lg font-semibold text-slate-900">
                Add Transaction
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Record a new expense or income in a few seconds.
              </p>

              <div className="mt-5">
                <Button size="sm">Open</Button>
              </div>
            </CardContent>
          </Card>

          {/* Placeholder future card */}
          <Card className="border-dashed shadow-sm">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                +
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                More features soon
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Later you can add recent transactions, totals, and category
                breakdowns here.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
};

export default Home;
