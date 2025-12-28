export type Asset = {
  id: string;
  assetName: string;
  purchaseDate: Date;
  serialNumber: string;
  employee: Employee;
};
export type Employee = {
  id: number;
  fullName: string;
  email: string;
  departmentId: number;
  department: Department;
};

export type Department = {
  id: number;
  deptName: string;
  location: string;
  employees: Employee[];
};
