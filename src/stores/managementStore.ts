import { create } from "zustand";
import { toast } from "react-toastify";
import { api } from "../api/axios";
import type { Department, Employee } from "../types";

type ManagementStatus = "idle" | "loading" | "error";

type ManagementState = {
  departments: Department[];
  employees: Employee[];
  status: ManagementStatus;
  error: string;
  selectedDepartmentId: string;
  fetchDepartments: () => Promise<void>;
  fetchEmployeesByDepartment: (departmentId: string) => Promise<void>;
  clearEmployees: () => void;
  createDepartment: (
    payload: Omit<Department, "id" | "employees">
  ) => Promise<void>;
  updateDepartment: (
    departmentId: number,
    payload: Partial<Department>
  ) => Promise<void>;
  deleteDepartment: (departmentId: number) => Promise<void>;
  createEmployee: (payload: Omit<Employee, "id">) => Promise<void>;
  updateEmployee: (
    employeeId: number,
    payload: Partial<Employee>
  ) => Promise<void>;
  deleteEmployee: (employeeId: number) => Promise<void>;
};

export const useManagementStore = create<ManagementState>((set) => ({
  departments: [],
  employees: [],
  status: "idle",
  error: "",
  selectedDepartmentId: "",
  fetchDepartments: async () => {
    set({ status: "loading", error: "" });
    try {
      const response = await api.get("/api/departments");
      const data: Department[] = Array.isArray(response.data)
        ? response.data
        : [];
      set({ departments: data, status: "idle" });
      return;
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Departmanlar yüklenemedi.";
      set({
        status: "error",
        error: message,
      });
      toast.error(message);
      throw requestError;
    }
  },
  fetchEmployeesByDepartment: async (departmentId) => {
    set({ status: "loading", error: "", selectedDepartmentId: departmentId });
    try {
      const response = await api.get(
        `/api/departments/${departmentId}/employees`
      );
      const data: Employee[] = Array.isArray(response.data)
        ? response.data
        : [];
      set({ employees: data, status: "idle" });
      return;
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Personel listesi yüklenemedi.";
      set({
        status: "error",
        error: message,
      });
      toast.error(message);
      throw requestError;
    }
  },
  clearEmployees: () => {
    set({ employees: [], selectedDepartmentId: "" });
  },
  createDepartment: async (payload) => {
    set({ status: "loading", error: "" });
    try {
      const response = await api.post("/api/departments", payload);
      const created = response.data as Department;
      set((state) => ({
        departments: [...state.departments, created],
        status: "idle",
      }));
      toast.success("Departman eklendi.");
      return;
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Departman oluşturulamadı.";
      set({
        status: "error",
        error: message,
      });
      toast.error(message);
      throw requestError;
    }
  },
  updateDepartment: async (departmentId, payload) => {
    set({ status: "loading", error: "" });
    try {
      const response = await api.put(
        `/api/departments/${departmentId}`,
        payload
      );
      const updated = response.data as Department;
      set((state) => ({
        departments: state.departments.map((dept) =>
          dept.id === departmentId ? updated : dept
        ),
        status: "idle",
      }));
      toast.success("Departman güncellendi.");
      return;
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Departman güncellenemedi.";
      set({
        status: "error",
        error: message,
      });
      toast.error(message);
      throw requestError;
    }
  },
  deleteDepartment: async (departmentId) => {
    set({ status: "loading", error: "" });
    try {
      await api.delete(`/api/departments/${departmentId}`);
      set((state) => ({
        departments: state.departments.filter(
          (dept) => dept.id !== departmentId
        ),
        status: "idle",
      }));
      toast.info("Departman silindi.");
      return;
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Departman silinemedi.";
      set({
        status: "error",
        error: message,
      });
      toast.error(message);
      throw requestError;
    }
  },
  createEmployee: async (payload) => {
    set({ status: "loading", error: "" });
    try {
      const response = await api.post("/api/employees", payload);
      const created = response.data as Employee;
      set((state) => ({
        employees: [...state.employees, created],
        status: "idle",
      }));
      toast.success("Personel eklendi.");
      return;
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Personel oluşturulamadı.";
      set({
        status: "error",
        error: message,
      });
      toast.error(message);
      throw requestError;
    }
  },
  updateEmployee: async (employeeId, payload) => {
    set({ status: "loading", error: "" });
    try {
      const response = await api.put(`/api/employees/${employeeId}`, payload);
      const updated = response.data as Employee;
      set((state) => ({
        employees: state.employees.map((employee) =>
          employee.id === employeeId ? updated : employee
        ),
        status: "idle",
      }));
      toast.success("Personel güncellendi.");
      return;
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Personel güncellenemedi.";
      set({
        status: "error",
        error: message,
      });
      toast.error(message);
      throw requestError;
    }
  },
  deleteEmployee: async (employeeId) => {
    set({ status: "loading", error: "" });
    try {
      await api.delete(`/api/employees/${employeeId}`);
      set((state) => ({
        employees: state.employees.filter(
          (employee) => employee.id !== employeeId
        ),
        status: "idle",
      }));
      toast.info("Personel silindi.");
      return;
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Personel silinemedi.";
      set({
        status: "error",
        error: message,
      });
      toast.error(message);
      throw requestError;
    }
  },
}));
