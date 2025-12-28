import { useState } from "react";
import { FaUserShield } from "react-icons/fa";
import AssetListPanel from "./AssetListPanel";
import ManagementPanel from "./ManagementPanel";

type DashboardPageProps = {
  loggedInUser: string;
  onLogout: () => void;
};

type TabKey = "assets" | "management";

const DashboardPage = ({ loggedInUser, onLogout }: DashboardPageProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>("assets");

  return (
    <div className="min-h-screen bg-[#f4f1e8] px-6 py-12">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="m-0 tracking-[0.2em] text-xs font-semibold text-[#8a5a12]">
              GÖSTERGE PANELİ
            </p>
            <h1 className="m-0 text-3xl font-semibold">Envanter Yönetimi</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-slate-900/10 bg-white px-4 py-2 text-sm font-semibold text-[#1b1f1f] shadow-sm">
              <FaUserShield className="text-amber-600" aria-hidden="true" />
              <span>{loggedInUser}</span>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-full border border-slate-900/15 bg-white px-5 py-2 text-sm font-semibold text-[#1b1f1f] shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
            >
              Çıkış
            </button>
          </div>
        </header>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("assets")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === "assets"
                ? "bg-amber-500/20 text-amber-800"
                : "border border-slate-900/10 bg-white text-slate-600 hover:-translate-y-0.5"
            }`}
          >
            Varlık Listesi
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("management")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === "management"
                ? "bg-amber-500/20 text-amber-800"
                : "border border-slate-900/10 bg-white text-slate-600 hover:-translate-y-0.5"
            }`}
          >
            Yönetim Paneli
          </button>
        </div>

        {activeTab === "assets" ? (
          <AssetListPanel loggedInUser={loggedInUser} />
        ) : (
          <ManagementPanel />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
