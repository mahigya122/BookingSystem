import { supabase } from "./supabase";

export interface CabinData{
  name: string;
  capacity: number;
  price_per_night: number;
  discount: number;
  image_url: string;
  description?: string;
}

//create
export async function createCabin(cabin: CabinData){
    const {data, error} = await supabase
        .from("cabins")
        .insert([cabin])
        .select()
        .single(); 

     if (error) throw new Error(error.message);   

     return data;         
}

//delete
export async function deleteCabin(id: string){
    const {error} = await supabase
        .from("cabins")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);
}

//update 
export interface UpdateCabinData {
  id: string;
  data: Partial<CabinData>;
}

export async function updateCabin({ id, data }: UpdateCabinData) {
  const { data: updated, error } = await supabase
    .from("cabins")
    .update(data)
    .eq("id", id)
    .select()
    .single();

   if (error) throw new Error(error.message);

   return updated;   
}