export interface Parent {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
  }
  
  export interface ParentState {
    data: Parent[];
    loading: boolean;
    error: string | null;
  }
  
  type Meal = {
    id: string;
    title: string;
    description: string;
    ingredients: string;
    instructions: string;
    nutritional_info: string;
    age_group: string;
    meal_type: string;
    preparation_time: number;
    createdAt: string;
    updatedAt: string;
  };
  