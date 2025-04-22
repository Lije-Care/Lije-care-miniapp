export interface CreateChildDto {
    name: string;
    date_of_birth: string;
    gender: "Male" | "Female";
    weight: number;
    height: number;
    muac: number;
    parentId: string;
  }
  
  export interface Child {
    id: string;
    parentId: string;
    name: string;
    date_of_birth: string;
    gender: string;
    weight: number;
    height: number;
    muac: number | null;
    dietary_restrictions: string | null;
    allergies: string | null;
    medications: string | null;
    createdAt: string;
    updatedAt: string;
  }