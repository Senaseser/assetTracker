import { useEffect, type ChangeEvent, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";
import { api } from "../api/axios";
import { useAssetStore } from "../stores/assetStore";
import { useManagementStore } from "../stores/managementStore";
import type { Asset, Department, Employee } from "../types";

type AssetListPanelProps = {
  loggedInUser: string;
};

type ModalState =
  | { type: "assign"; assetId: string }
  | { type: "unassign"; assetId: string }
  | null;

type FilterBarProps = {
  search: string;
  departmentId: string;
  assigned: "all" | "assigned" | "unassigned";
  departments: Department[];
  onSearch: (value: string) => void;
  onDepartment: (value: string) => void;
  onAssigned: (value: "all" | "assigned" | "unassigned") => void;
  onClear: () => void;
};

const FilterBar = ({
  search,
  departmentId,
  assigned,
  departments,
  onSearch,
  onDepartment,
  onAssigned,
  onClear,
}: FilterBarProps) => (
  <div className="mt-6 grid gap-4 rounded-2xl border border-slate-900/10 bg-white p-4 md:grid-cols-[1.2fr_1fr_1fr_auto]">
    <label className="grid gap-2 text-xs font-semibold tracking-[0.18em] text-[#7b8484]">
      ARAMA
      <input
        type="text"
        value={search}
        onChange={(event) => onSearch(event.target.value)}
        placeholder="Varlık adı veya seri no"
        className="rounded-lg border border-slate-900/15 px-3 py-2 text-sm font-medium text-[#1b1f1f] focus:outline-none focus:ring-2 focus:ring-amber-500/30"
      />
    </label>
    <label className="grid gap-2 text-xs font-semibold tracking-[0.18em] text-[#7b8484]">
      DEPARTMAN
      <select
        value={departmentId}
        onChange={(event) => onDepartment(event.target.value)}
        className="rounded-lg border border-slate-900/15 px-3 py-2 text-sm font-medium text-[#1b1f1f] focus:outline-none focus:ring-2 focus:ring-amber-500/30"
      >
        <option value="">Tümü</option>
        {departments.map((department) => (
          <option key={department.id} value={String(department.id)}>
            {department.deptName}
          </option>
        ))}
      </select>
    </label>
    <label className="grid gap-2 text-xs font-semibold tracking-[0.18em] text-[#7b8484]">
      ZİMMET
      <select
        value={assigned}
        onChange={(event) =>
          onAssigned(event.target.value as "all" | "assigned" | "unassigned")
        }
        className="rounded-lg border border-slate-900/15 px-3 py-2 text-sm font-medium text-[#1b1f1f] focus:outline-none focus:ring-2 focus:ring-amber-500/30"
      >
        <option value="all">Tümü</option>
        <option value="assigned">Zimmetli</option>
        <option value="unassigned">Boş</option>
      </select>
    </label>
    <div className="flex items-end">
      <button
        type="button"
        onClick={onClear}
        className="w-full rounded-full border border-slate-900/15 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:-translate-y-0.5 hover:bg-slate-50 cursor-pointer"
      >
        Filtreyi Sıfırla
      </button>
    </div>
  </div>
);

type AssetTableProps = {
  assets: Asset[];
  loading: boolean;
  onAssign: (assetId: string) => void;
  onUnassign: (assetId: string) => void;
};

const AssetTable = ({
  assets,
  loading,
  onAssign,
  onUnassign,
}: AssetTableProps) => (
  <div className="mt-6 overflow-x-auto">
    <table className="w-full border-separate border-spacing-y-3 text-left text-sm">
      <thead className="text-xs tracking-[0.2em] text-[#7b8484]">
        <tr>
          <th className="px-4">VARLIK</th>
          <th className="px-4">DEPARTMAN</th>
          <th className="px-4">PERSONEL</th>
          <th className="px-4">DURUM</th>
          <th className="px-4 text-right">AKSİYON</th>
        </tr>
      </thead>
      <tbody>
        {assets.map((asset) => (
          <tr
            key={asset.id}
            className="rounded-2xl bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
          >
            <td className="px-4 py-4 font-semibold text-[#1b1f1f]">
              {asset.assetName}
            </td>
            <td className="px-4 py-4 text-[#4b5252]">
              {asset.employee.department?.deptName ?? "-"}
            </td>
            <td className="px-4 py-4 text-[#4b5252]">
              {asset.employee.fullName || "-"}
            </td>
            <td className="px-4 py-4">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  asset.employee.id
                    ? "bg-emerald-500/15 text-emerald-700"
                    : "bg-slate-900/10 text-slate-600"
                }`}
              >
                {asset.employee.id ? "Zimmetli" : "Boş"}
              </span>
            </td>
            <td className="px-4 py-4 text-right">
              {asset.employee.id ? (
                <button
                  type="button"
                  onClick={() => onUnassign(asset.id)}
                  className="rounded-full bg-rose-500/15 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-500/25 cursor-pointer"
                >
                  Zimmetten Çıkar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onAssign(asset.id)}
                  className="rounded-full bg-amber-500/20 px-4 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-500/30 cursor-pointer"
                >
                  Zimmetle
                </button>
              )}
            </td>
          </tr>
        ))}
        {!loading && assets.length === 0 ? (
          <tr>
            <td
              colSpan={5}
              className="px-4 py-8 text-center text-sm text-[#5c6666]"
            >
              Gösterilecek varlık bulunamadı.
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  </div>
);

const AssetListPanel = ({ loggedInUser }: AssetListPanelProps) => {
  const {
    assets,
    status: assetsStatus,
    error: assetsError,
    fetchAssets,
    updateAssetEmployee,
    filters,
    setFilters,
    clearFilters,
  } = useAssetStore();
  const {
    departments,
    employees,
    fetchDepartments,
    fetchEmployeesByDepartment,
  } = useManagementStore();

  const [modalState, setModalState] = useState<ModalState>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [modalError, setModalError] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [employeesLoading, setEmployeesLoading] = useState(false);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const search = filters.search.trim().toLowerCase();
      const matchesSearch = search
        ? asset.assetName.toLowerCase().includes(search) ||
          asset.serialNumber.toLowerCase().includes(search)
        : true;
      const matchesDepartment = filters.departmentId
        ? String(
            asset.employee.departmentId || asset.employee.department?.id
          ) === filters.departmentId
        : true;
      const matchesAssigned =
        filters.assigned === "all"
          ? true
          : filters.assigned === "assigned"
          ? asset.employee.id > 0
          : asset.employee.id === 0;
      return matchesSearch && matchesDepartment && matchesAssigned;
    });
  }, [assets, filters]);

  useEffect(() => {
    if (!loggedInUser) {
      return;
    }
    fetchAssets();
  }, [loggedInUser, fetchAssets]);

  useEffect(() => {
    if (departments.length === 0) {
      fetchDepartments();
    }
  }, [departments.length, fetchDepartments]);

  useEffect(() => {
    if (modalState?.type !== "assign") {
      return;
    }
    if (!selectedEmployeeId && employees.length > 0) {
      setSelectedEmployeeId(String(employees[0].id));
    }
  }, [employees, modalState, selectedEmployeeId]);

  const openAssignModal = async (assetId: string) => {
    setModalError("");
    setSelectedDepartmentId("");
    setSelectedEmployeeId("");
    setModalState({ type: "assign", assetId });
    try {
      await fetchDepartments();
    } catch (requestError) {
      setModalError(
        requestError instanceof Error
          ? requestError.message
          : "Departmanlar yüklenemedi."
      );
    }
  };

  const openUnassignModal = (assetId: string) => {
    setModalError("");
    setModalState({ type: "unassign", assetId });
  };

  const closeModal = () => {
    if (modalLoading) {
      return;
    }
    setModalState(null);
    setModalError("");
  };

  const handleDepartmentChange = async (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const departmentId = event.target.value;
    setSelectedDepartmentId(departmentId);
    setSelectedEmployeeId("");
    setEmployeesLoading(true);
    setModalError("");

    if (!departmentId) {
      setEmployeesLoading(false);
      return;
    }

    try {
      await fetchEmployeesByDepartment(departmentId);
    } catch (requestError) {
      setModalError(
        requestError instanceof Error
          ? requestError.message
          : "Personel listesi yüklenemedi."
      );
    } finally {
      setEmployeesLoading(false);
    }
  };

  const buildFallbackDepartment = (departmentId: string): Department => ({
    id: Number(departmentId) || 0,
    deptName: "-",
    location: "",
    employees: [],
  });

  const handleAssignConfirm = async () => {
    if (!modalState || modalState.type !== "assign") {
      return;
    }

    if (!selectedDepartmentId || !selectedEmployeeId) {
      setModalError("Departman ve personel seçmelisin.");
      return;
    }

    setModalLoading(true);
    setModalError("");

    try {
      await api.patch(`/api/assets/${modalState.assetId}`, {
        employeeId: Number(selectedEmployeeId),
      });
      const selectedEmployee = employees.find(
        (item) => String(item.id) === selectedEmployeeId
      );
      const selectedDepartment = departments.find(
        (item) => String(item.id) === selectedDepartmentId
      );
      const resolvedDepartment =
        selectedEmployee?.department ??
        selectedDepartment ??
        buildFallbackDepartment(selectedDepartmentId);
      const resolvedEmployee: Employee = selectedEmployee
        ? {
            ...selectedEmployee,
            department: resolvedDepartment,
            departmentId: resolvedDepartment.id,
          }
        : {
            id: Number(selectedEmployeeId),
            fullName: "Atandı",
            email: "",
            departmentId: resolvedDepartment.id,
            department: resolvedDepartment,
          };
      updateAssetEmployee(modalState.assetId, resolvedEmployee);
      toast.success("Zimmetleme tamamlandı.");
      setModalState(null);
    } catch (requestError) {
      setModalError(
        requestError instanceof Error
          ? requestError.message
          : "Zimmetleme başarısız."
      );
      toast.error(
        requestError instanceof Error
          ? requestError.message
          : "Zimmetleme başarısız."
      );
    } finally {
      setModalLoading(false);
    }
  };

  const handleUnassignConfirm = async () => {
    if (!modalState || modalState.type !== "unassign") {
      return;
    }

    setModalLoading(true);
    setModalError("");

    try {
      await api.patch(`/api/assets/${modalState.assetId}`, {
        employeeId: null,
      });
      updateAssetEmployee(modalState.assetId, null);
      toast.info("Zimmetten çıkarıldı.");
      setModalState(null);
    } catch (requestError) {
      setModalError(
        requestError instanceof Error
          ? requestError.message
          : "Zimmetten çıkarma başarısız."
      );
      toast.error(
        requestError instanceof Error
          ? requestError.message
          : "Zimmetten çıkarma başarısız."
      );
    } finally {
      setModalLoading(false);
    }
  };

  const activeAsset = modalState
    ? assets.find((item) => item.id === modalState.assetId)
    : null;

  return (
    <section className="rounded-3xl bg-white/85 p-6 shadow-[0_30px_80px_rgba(23,23,23,0.12)] backdrop-blur-xl">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="m-0 text-xl font-semibold">Varlık Listesi</h2>
          <p className="m-0 text-sm text-[#5c6666]">
            Personel ve departman bilgileri ile zimmet durumlarını takip edin.
          </p>
        </div>
        {assetsStatus === "loading" ? (
          <span className="text-sm font-medium text-amber-700">
            Yükleniyor...
          </span>
        ) : null}
      </header>

      <FilterBar
        search={filters.search}
        departmentId={filters.departmentId}
        assigned={filters.assigned}
        departments={departments}
        onSearch={(value) => setFilters({ search: value })}
        onDepartment={(value) => setFilters({ departmentId: value })}
        onAssigned={(value) => setFilters({ assigned: value })}
        onClear={clearFilters}
      />

      {assetsError ? (
        <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-700">
          {assetsError}
        </p>
      ) : null}

      <AssetTable
        assets={filteredAssets}
        loading={assetsStatus === "loading"}
        onAssign={openAssignModal}
        onUnassign={openUnassignModal}
      />

      {modalState && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
              <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="m-0 tracking-[0.2em] text-xs font-semibold text-[#8a5a12] cursor-pointer">
                      {modalState.type === "assign"
                        ? "ZİMMETLE"
                        : "ZİMMETTEN ÇIKAR"}
                    </p>
                    <h3 className="m-0 text-xl font-semibold text-[#1b1f1f]">
                      {activeAsset?.assetName ?? "Varlık"}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full border border-slate-900/15 px-3 py-1 text-xs font-semibold text-slate-600 cursor-pointer"
                  >
                    Kapat
                  </button>
                </div>

                {modalState.type === "unassign" ? (
                  <div className="mt-6 space-y-4">
                    <p className="m-0 text-sm text-[#4b5252]">
                      Bu varlığı zimmetten çıkarmak istediğinize emin misiniz?
                    </p>
                    {modalError ? (
                      <p className="m-0 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-700">
                        {modalError}
                      </p>
                    ) : null}
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={closeModal}
                        disabled={modalLoading}
                        className="rounded-full border border-slate-900/15 px-4 py-2 text-xs font-semibold text-slate-600 disabled:opacity-60 cursor-pointer"
                      >
                        Vazgeç
                      </button>
                      <button
                        type="button"
                        onClick={handleUnassignConfirm}
                        disabled={modalLoading}
                        className="rounded-full bg-rose-500/15 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-500/25 disabled:opacity-60 cursor-pointer"
                      >
                        Zimmetten Çıkar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    <p className="m-0 text-sm text-[#4b5252]">
                      Zimmetine geçirmek istediğiniz kişiyi seçin.
                    </p>
                    <label className="grid gap-2 text-sm font-medium text-[#1b1f1f]">
                      Departman
                      <select
                        value={selectedDepartmentId}
                        onChange={handleDepartmentChange}
                        className="rounded-lg border border-slate-900/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                      >
                        <option value="">Departman seç</option>
                        {departments.length === 0 ? (
                          <option value="" disabled>
                            Departman yok
                          </option>
                        ) : null}
                        {departments.map((department) => (
                          <option
                            key={department.id}
                            value={String(department.id)}
                          >
                            {department.deptName}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-[#1b1f1f]">
                      Personel
                      <select
                        value={selectedEmployeeId}
                        onChange={(event) =>
                          setSelectedEmployeeId(event.target.value)
                        }
                        disabled={!selectedDepartmentId || employeesLoading}
                        className="rounded-lg border border-slate-900/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 disabled:bg-slate-100"
                      >
                        {employees.length === 0 ? (
                          <option value="">Personel yok</option>
                        ) : null}
                        {employees.map((employee) => (
                          <option key={employee.id} value={String(employee.id)}>
                            {employee.fullName}
                          </option>
                        ))}
                      </select>
                    </label>
                    {modalError ? (
                      <p className="m-0 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-700">
                        {modalError}
                      </p>
                    ) : null}
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={closeModal}
                        disabled={modalLoading}
                        className="rounded-full border border-slate-900/15 px-4 py-2 text-xs font-semibold text-slate-600 disabled:opacity-60 cursor-pointer"
                      >
                        Vazgeç
                      </button>
                      <button
                        type="button"
                        onClick={handleAssignConfirm}
                        disabled={modalLoading}
                        className="rounded-full bg-amber-500/20 px-4 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-500/30 disabled:opacity-60 cursor-pointer"
                      >
                        Zimmetle
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>,
            document.body
          )
        : null}
    </section>
  );
};

export default AssetListPanel;
