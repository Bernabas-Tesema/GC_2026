export interface Student {
  id: string;
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  academicDepartment: string;
  fellowshipDepartment: string;
  lastWords: string;
  largePhotoUrl: string;
  smallPhotoUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentGallery {
  id: string;
  fellowshipDepartment: string;
  title: string;
  description: string;
  photoUrls: string[];
  createdAt: string;
}

export type Language = "en" | "am";
