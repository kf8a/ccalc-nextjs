import { nanoid } from "nanoid";
export interface County {
  id: number;
  name: string;
  state: string;
  c_zero: number;
  bulk_density: number;
  precipitation: number;
  t_min: number;
  t_max: number;
  clay: number;
  crop_yield?: Array<number>;
}

export type crop =
  | "corn"
  | "soybean"
  | "wheat"
  | "oats"
  | "silage"
  | "switchgrass";

export type unit_system_type = "imperial" | "metric";
export type tillage = "conventional" | "reduced" | "no-till";

export type rotation_info = {
  id: string;
  year: number;
  crop_name: crop;
  crop_yield: number;
  tillage: tillage;
  nitrogen: number;
};

export type scenario_info = {
  id: string;
  title: string;
  color: string;
  rotations: Array<rotation_info>;
};

export type data_info = {
  units: unit_system_type;
  last_units: unit_system_type;
  tier: 1 | 2;
  county: County;
  scenarios: Array<scenario_info>;
};

export type factors_type = {
  proportion_of_carbon_to_organics: number;
  temperature: number;
  moisture: number;
  PROPORTION_OF_ORGANICS_TO_HUMUS: number;
};

export type scenario_result_type = {
  title: string;
  results: results_type[];
};

export type results_type = {
  id: number;
  c_zero: number;
  organic_carbon_percentage: number;
  annual_co2_kg_c_ha: number;
  nitrogen_mineralized: number;
  balance: number;
  decomposable_plant_material: number;
  humus_organic_carbon: number;
  labile_microbial_biomass: number;
  resistant_plant_material: number;
  stable_microbial_biomass: number;
  total_initial_carbon_kg: number;
  litter_cummulative: number;
  total_all_carbon_kg: number;
  soil_co2_estimate: number;
  fertilizer_co2_estimate: number;
  fuel_co2_estimate: number;
  fertilizer_production: number;
  n2o_n_estimate_percentage: number;
  color: string;
};

export const initial_model: data_info = {
  units: "imperial",
  last_units: "imperial",
  tier: 1,
  county: {
    id: 0,
    name: "Some",
    state: "MI",
    precipitation: 900,
    t_max: 28,
    t_min: -40,
    clay: 7,
    bulk_density: 2,
    c_zero: 1,
  },
  scenarios: [
    {
      id: nanoid(),
      title: "Base Scenario",
      color: "#000000",
      rotations: [
        {
          id: nanoid(),
          year: 0,
          crop_name: "corn",
          crop_yield: 148,
          tillage: "conventional",
          nitrogen: 142,
        },
        {
          year: 1,
          id: nanoid(),
          crop_name: "soybean",
          crop_yield: 38.3,
          tillage: "conventional",
          nitrogen: 0,
        },
      ],
    },
  ],
};
