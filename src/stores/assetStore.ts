import { create } from "zustand";
import { toast } from "react-toastify";
import { api } from "../api/axios";
import type { Asset, Department, Employee } from "../types";

type AssetStatus = "idle" | "loading" | "error";

type AssetFilters = {
  search: string;
  departmentId: string;
  assigned: "all" | "assigned" | "unassigned";
};

type AssetState = {
  assets: Asset[];
  status: AssetStatus;
  error: string;
  filters: AssetFilters;
  setFilters: (partial: Partial<AssetFilters>) => void;
  clearFilters: () => void;
  fetchAssets: () => Promise<void>;
  updateAssetEmployee: (assetId: string, employee: Employee | null) => void;
};

const emptyDepartment: Department = {
  id: 0,
  deptName: "-",
  location: "",
  employees: [],
};

const emptyEmployee: Employee = {
  id: 0,
  fullName: "-",
  email: "",
  departmentId: 0,
  department: emptyDepartment,
};

const normalizeAssets = (data: unknown): Asset[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  const pickString = (...values: unknown[]) => {
    for (const value of values) {
      if (typeof value === "string" && value.trim().length > 0) {
        return value;
      }
    }
    return "";
  };

  return data.map((raw, index) => {
    const record = raw as Record<string, unknown>;
    const idValue =
      record.id ?? record.assetId ?? record.serialNumber ?? `asset-${index + 1}`;
    const assetName = pickString(
      record.assetName,
      record.name,
      record.title,
      record.model,
      record.serialNumber
    );
    const serialNumber = pickString(
      record.serialNumber,
      record.serial,
      record.code
    );
    const purchaseDateValue =
      record.purchaseDate instanceof Date
        ? record.purchaseDate
        : typeof record.purchaseDate === "string"
        ? new Date(record.purchaseDate)
        : new Date();
    const rawEmployee = record.employee as Employee | undefined;
    const rawDepartment = rawEmployee?.department;
    const normalizedDepartment = rawDepartment
      ? {
          id: rawDepartment.id ?? 0,
          deptName: rawDepartment.deptName ?? "-",
          location: rawDepartment.location ?? "",
          employees: rawDepartment.employees ?? [],
        }
      : emptyDepartment;
    const normalizedEmployee = rawEmployee
      ? {
          id: rawEmployee.id ?? 0,
          fullName: rawEmployee.fullName ?? "-",
          email: rawEmployee.email ?? "",
          departmentId: rawEmployee.departmentId ?? normalizedDepartment.id,
          department: normalizedDepartment,
        }
      : emptyEmployee;

    return {
      id: String(idValue),
      assetName: assetName || `Varlık ${index + 1}`,
      purchaseDate: purchaseDateValue,
      serialNumber,
      employee: normalizedEmployee,
    };
  });
};

export const useAssetStore = create<AssetState>((set) => ({
  assets: [],
  status: "idle",
  error: "",
  filters: {
    search: "",
    departmentId: "",
    assigned: "all",
  },
  setFilters: (partial) =>
    set((state) => ({
      filters: { ...state.filters, ...partial },
    })),
  clearFilters: () =>
    set({
      filters: {
        search: "",
        departmentId: "",
        assigned: "all",
      },
    }),
  fetchAssets: async () => {
    set({ status: "loading", error: "" });
    try {
      const response = await api.get("/api/assets");
      set({ assets: normalizeAssets(response.data), status: "idle" });
    } catch (requestError) {
      set({
        assets: [],
        status: "error",
        error:
          requestError instanceof Error
            ? requestError.message
            : "Envanter verileri alınamadı.",
      });
      toast.error(
        requestError instanceof Error
          ? requestError.message
          : "Envanter verileri alınamadı."
      );
    }
  },
  updateAssetEmployee: (assetId, employee) =>
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              employee: employee ?? emptyEmployee,
            }
          : asset
      ),
    })),
}));
