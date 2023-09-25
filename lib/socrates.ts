import { County, rotation_info, results_type, factors_type } from "./model.ts";

class Pool {
  labile_microbial_biomass: number;
  decomposable_plant_material: number;
  resistant_plant_material: number;
  stable_microbial_biomass: number;
  humus_organic_carbon: number;
  constructor(
    labile_microbial_biomass: number,
    decomposable_plant_material: number,
    resistant_plant_material: number,
    stable_microbial_biomass: number,
    humus_organic_carbon: number
  ) {
    this.labile_microbial_biomass = labile_microbial_biomass;
    this.decomposable_plant_material = decomposable_plant_material;
    this.resistant_plant_material = resistant_plant_material;
    this.stable_microbial_biomass = stable_microbial_biomass;
    this.humus_organic_carbon = humus_organic_carbon;
  }

  get total_carbon() {
    return (
      this.labile_microbial_biomass +
      this.decomposable_plant_material +
      this.resistant_plant_material +
      this.stable_microbial_biomass +
      this.humus_organic_carbon
    );
  }

  get total_soil_carbon() {
    return (
      this.decomposable_plant_material +
      this.stable_microbial_biomass +
      this.humus_organic_carbon +
      this.labile_microbial_biomass
    );
  }
}

const tillages = [
  {
    name: "no-till",
    additional_leaf_removed: 1.0,
    rate_4_modifier: 0.9,
    liters_per_hectare: 26.0,
  },
  {
    name: "reduced",
    additional_leaf_removed: 0.55,
    rate_4_modifier: 0.975,
    liters_per_hectare: 33.0,
  },
  {
    name: "conventional",
    additional_leaf_removed: 0.35,
    rate_4_modifier: 1.0,
    liters_per_hectare: 47.0,
  },
];

const crops = [
  {
    id: 1,
    name: "wheat",
    plant_ratio: 0.59,
    root_distribution: 0.33,
    leaf_returned: 1,
    plant_moisture_factor: 0.155,
    harvest_index: 0.39,
    roots: 0.4,
    description: "winter wheat",
    units: { metric: "MT/ha", imperial: "bu/ac" },
    default_yield: 2.7,
    default_n: 74,
    root_n: 0.009,
    biomass_n: 0.006,
  },
  {
    id: 3,
    name: "corn",
    plant_ratio: 0.59,
    root_distribution: 0.33,
    leaf_returned: 1,
    plant_moisture_factor: 0.155,
    harvest_index: 0.52,
    roots: 0.4,
    description: "Corn grain",
    units: { metric: "MT/ha", imperial: "bu/ac" },
    default_yield: 9.3,
    default_n: 159,
    root_n: 0.007,
    biomass_n: 0.006,
  },
  {
    id: 6,
    name: "soybean",
    plant_ratio: 0.66,
    root_distribution: 0.35,
    leaf_returned: 1,
    plant_moisture_factor: 0.155,
    harvest_index: 0.42,
    roots: 0.4,
    description: "Soybeans",
    units: { metric: "MT/ha", imperial: "bu/ac" },
    default_yield: 2.6,
    default_n: 0,
    root_n: 0.008,
    biomass_n: 0.008,
  },
  {
    id: 2,
    name: "oats",
    plant_ratio: 0.59,
    root_distribution: 0.33,
    leaf_returned: 1,
    plant_moisture_factor: 0.155,
    harvest_index: 0.5,
    roots: 0.4,
    description: "Oats",
    units: { metric: "MT/ha", imperial: "bu/ac" },
    default_yield: 3.9,
    default_n: 74,
    root_n: 0.008,
    biomass_n: 0.007,
  },
  {
    id: 4,
    name: "switchgrass",
    plant_ratio: 0.59,
    root_distribution: 0.33,
    leaf_returned: 0.2,
    plant_moisture_factor: 0.155,
    harvest_index: 1,
    roots: 0.5,
    description: "Switchgrass/Hay",
    units: { metric: "MT/ha", imperial: "t/ac" },
    default_yield: 7,
    first_year_yield: 3.5,
    default_n: 70,
    root_n: 0.012,
    biomass_n: 0.15,
  },
  {
    id: 5,
    name: "silage",
    plant_ratio: 0.59,
    root_distribution: 0.33,
    leaf_returned: 0.2,
    plant_moisture_factor: 0.155,
    harvest_index: 1,
    roots: 0.4,
    description: "Corn silage",
    units: { metric: "MT/ha", imperial: "t/ac" },
    default_yield: 33,
    default_n: 159,
    root_n: 0.007,
    biomass_n: 0.006,
  },
  {
    id: 7,
    name: "alfalfa",
    plant_ratio: 0.6,
    root_distribution: 0.35,
    leaf_returned: 0.2,
    plant_moisture_factor: 0.155,
    harvest_index: 1,
    roots: 0.4,
    description: "Alfalfa",
    units: { metric: "MT/ha", imperial: "t/ac" },
    default_yield: 6,
    default_n: 0,
    root_n: 0.019,
    biomass_n: 0.027,
  },
];

type organic_matter_type =
  | "labile_microbial_biomass"
  | "decomposable_plant_material"
  | "resistant_plant_material"
  | "stable_microbial_biomass"
  | "humus_organic_carbon";

function find_crop(crop_name: string) {
  let my_crop = crops.find((element) => element.name == crop_name);
  if (my_crop == undefined) {
    throw new Error(`Invalid crop name: ${crop_name}`);
  }
  return my_crop;
}

function find_tillage(tillage_name: string) {
  let my_tillage = tillages.find((element) => element.name == tillage_name);
  if (my_tillage == undefined) {
    throw new Error(`Invalid tillage name: ${tillage_name}`);
  }
  return my_tillage;
}

export function socrates(
  rotations: Array<rotation_info>,
  county: County,
  tier: 1 | 2
): Array<results_type> {
  const results: Array<results_type> = [];
  const MICROBIAL_FRACTION = 0.05;
  const DEPTH_LAYER_IN_CM = 10;
  const PROPORTION_OF_LIGHT_FRACTION = 0.05;

  const HUMUS_FRACTION = 1 - MICROBIAL_FRACTION;

  const decomposition_rate = new Pool(0.95, 0.84, 0.07, 0.055, 0.0009);

  const total_carbon_kg =
    county.c_zero * 1000 * county.bulk_density * DEPTH_LAYER_IN_CM;

  var soc = new Pool(
    0.0001,
    0.0001,
    PROPORTION_OF_LIGHT_FRACTION * total_carbon_kg,
    MICROBIAL_FRACTION * total_carbon_kg,
    HUMUS_FRACTION * total_carbon_kg
  );

  // add up the inital carbon
  var total_initial_carbon_kg = soc.total_carbon;

  var last_organic_carbon_percentage = county.c_zero;

  // determine partitioning of organic products based on CEC
  // clayPercentage and annual climate data is in county soil database
  const cec_mmol = county.clay * 3.91 + 57.85;

  let proportion_of_carbon_to_organics = (34.4 + 0.04 * cec_mmol) / 100;
  if (cec_mmol <= 100) {
    proportion_of_carbon_to_organics = (21.7 + 0.17 * cec_mmol) / 100;
  }

  const annual_temperature = (county.t_max + county.t_min) / 2;

  const factors: factors_type = {
    proportion_of_carbon_to_organics: proportion_of_carbon_to_organics,

    // init moisture and temperature factors
    // Temperature factor, where annual_temp is just mean annual air temp (deg C)
    temperature: 0.177 * Math.exp(0.069 * annual_temperature),

    // This moisture factor was provided by Peter based on the work of Waltman
    moisture: 0.059 * Math.pow(county.precipitation, 0.279),

    PROPORTION_OF_ORGANICS_TO_HUMUS: 0.03,
  };

  // Zero totals
  var total_co2_kg_c_ha = 0;
  var total_soil_carbon_kg = 0;
  var total_all_carbon_kg = 0;
  var litter_cummulative = 0;
  var litter_leaf = 0;
  var litter_root = 0;

  // neeed to sort by year
  for (let year = 0; year < rotations.length; year++) {
    if (rotations[year] == undefined) {
      continue;
    }
    const current_rotation = rotations[year];
    var annual_co2_kg_c_ha = 0;

    var crop = find_crop(current_rotation.crop_name);
    var tillage = find_tillage(current_rotation.tillage);

    // Default values for litter_leaf (total leaf), litter_root (total roots) in the county crop database
    // If yield values are given, calculations below
    var grain_biomass =
      current_rotation.crop_yield / (1 + crop.plant_moisture_factor);
    var total_aboveground_dry_biomass = grain_biomass / crop.harvest_index;

    litter_leaf = total_aboveground_dry_biomass - grain_biomass;

    litter_root = total_aboveground_dry_biomass * crop.roots;

    var litter_total_kg =
      crop.leaf_returned * tillage.additional_leaf_removed * litter_leaf +
      litter_root * crop.root_distribution;

    litter_cummulative += litter_total_kg * 0.4;

    let decomposable_plant_material = litter_total_kg * crop.plant_ratio * 0.4;
    let resistant_plant_material =
      litter_total_kg * 0.4 - decomposable_plant_material;

    soc.decomposable_plant_material += decomposable_plant_material;
    soc.resistant_plant_material += resistant_plant_material;

    decomposition_rate.humus_organic_carbon *= tillage.rate_4_modifier;

    var flows = {
      soc: new Pool(0, 0, 0, 0, 0),
      co2: new Pool(0, 0, 0, 0, 0),
      humus: new Pool(0, 0, 0, 0, 0),
      biomass: new Pool(0, 0, 0, 0, 0),
    };

    //step through the weeks
    for (let week = 0; week < 52; week++) {
      ({ total_co2_kg_c_ha, annual_co2_kg_c_ha } = labile_plant_matter(
        soc,
        flows,
        decomposition_rate,
        factors,
        total_co2_kg_c_ha,
        annual_co2_kg_c_ha
      ));

      time_step(
        soc,
        flows,
        decomposition_rate,
        factors,
        "decomposable_plant_material"
      );
      total_co2_kg_c_ha += flows.co2.decomposable_plant_material;
      annual_co2_kg_c_ha += flows.co2.decomposable_plant_material;

      time_step(
        soc,
        flows,
        decomposition_rate,
        factors,
        "resistant_plant_material"
      );
      total_co2_kg_c_ha += flows.co2.resistant_plant_material;
      annual_co2_kg_c_ha += flows.co2.resistant_plant_material;

      time_step(
        soc,
        flows,
        decomposition_rate,
        factors,
        "stable_microbial_biomass"
      );
      total_co2_kg_c_ha += flows.co2.stable_microbial_biomass;
      annual_co2_kg_c_ha += flows.co2.stable_microbial_biomass;

      time_step(
        soc,
        flows,
        decomposition_rate,
        factors,
        "humus_organic_carbon"
      );

      total_co2_kg_c_ha += flows.co2.humus_organic_carbon;
      annual_co2_kg_c_ha += flows.co2.humus_organic_carbon;

      soc.decomposable_plant_material -= flows.soc.decomposable_plant_material;

      soc.resistant_plant_material -= flows.soc.resistant_plant_material;

      soc.stable_microbial_biomass +=
        flows.biomass.stable_microbial_biomass +
        flows.biomass.humus_organic_carbon -
        flows.soc.stable_microbial_biomass;

      soc.humus_organic_carbon +=
        flows.humus.decomposable_plant_material +
        flows.humus.resistant_plant_material +
        flows.humus.stable_microbial_biomass +
        flows.humus.humus_organic_carbon -
        flows.soc.humus_organic_carbon;

      soc.labile_microbial_biomass +=
        flows.biomass.decomposable_plant_material +
        flows.biomass.resistant_plant_material;
    }
    // total_soil_C is total organic C in SOIL only
    // SOC's definition of resistant_plant_material i.e. soc(2) excludes it from the calculation
    // RPM is analogous to light fraction
    total_soil_carbon_kg = soc.total_soil_carbon;

    total_all_carbon_kg = soc.total_carbon;

    // convert kg/ha back to % organic carbon
    var c_zero =
      total_soil_carbon_kg / (1000 * county.bulk_density * DEPTH_LAYER_IN_CM);

    // mass  balance  check
    var balance =
      total_initial_carbon_kg +
      litter_cummulative -
      total_all_carbon_kg -
      total_co2_kg_c_ha;

    // simplified N calcualation for N mineralized  from soil C/N = 10/1
    var nitrogen_mineralized = (total_carbon_kg - total_soil_carbon_kg) / 10;

    var result: results_type = {
      id: year,
      c_zero: last_organic_carbon_percentage,
      organic_carbon_percentage: c_zero,
      annual_co2_kg_c_ha: annual_co2_kg_c_ha,
      nitrogen_mineralized: nitrogen_mineralized,
      balance: balance,
      decomposable_plant_material: soc.decomposable_plant_material,
      humus_organic_carbon: soc.humus_organic_carbon,
      labile_microbial_biomass: soc.labile_microbial_biomass,
      resistant_plant_material: soc.resistant_plant_material,
      stable_microbial_biomass: soc.stable_microbial_biomass,
      total_initial_carbon_kg: total_initial_carbon_kg,
      litter_cummulative: litter_cummulative,
      total_all_carbon_kg: total_all_carbon_kg,
      soil_co2_estimate: 0,
      fertilizer_co2_estimate: 0,
      fuel_co2_estimate: 0,
      fertilizer_production: 0,
      n2o_n_estimate_percentage: 0,
      color: "#000000",
    };

    // calculate CO2 emissions
    // here we are using indexing to refer back to the previous year  using results[year]
    var soil_carbon_change_in_tonnes =
      (last_organic_carbon_percentage - result.organic_carbon_percentage) *
      county.bulk_density *
      DEPTH_LAYER_IN_CM;

    result.soil_co2_estimate = (soil_carbon_change_in_tonnes * 44) / 12;

    // add fertilizer N2O
    // let n2o_n_estimate_percentage = 0;
    // if (county.clay  > 10) {
    //   n2o_n_estimate_percentage  = (-4.8  + 0.067 * county.clay/100) + (3.77  * county.bulk_density)
    //   if (current_rotation.tillage_id == 'no-till') {
    //     n2o_n_estimate_percentage = (-4.8  + 0.067 * county.clay/100) + (3.77  * county.bulk_density * 0.95)
    //   }
    // }

    // make it 1.25% for now
    result.n2o_n_estimate_percentage = 1.25;

    // add N from the root and stover biomass as per tier 1 recommendations
    var additional_n = litter_root * crop.root_n + litter_leaf * crop.biomass_n;

    var fertilizer_n2o_n_tonnes =
      (0.01 * current_rotation.nitrogen + additional_n * 0.0125) / 1000;
    if (tier == 2) {
      fertilizer_n2o_n_tonnes =
        (1.47 * Math.exp(0.0082 * current_rotation.nitrogen) +
          additional_n * 0.0125) /
        1000;
    }
    var fertilizer_n2o_tonnes = (fertilizer_n2o_n_tonnes * 44) / 28;
    result.fertilizer_co2_estimate = fertilizer_n2o_tonnes * 298; //310    // Global warming potential

    // add fuel estimate
    result.fuel_co2_estimate = (2.7 * tillage.liters_per_hectare) / 1000;

    // add fertilizer production estimate
    result.fertilizer_production =
      (current_rotation.nitrogen * 0.451314285714286) / 1000;

    // save last_organic_carbon_percentage
    last_organic_carbon_percentage = result.organic_carbon_percentage;

    results.push(result);
  }
  return results;
}

function labile_plant_matter(
  soc: Pool,
  flows: { soc: Pool; co2: Pool; humus: Pool; biomass: Pool },
  decomposition_rate: Pool,
  factors: factors_type,
  total_co2_kg_c_ha: number,
  annual_co2_kg_c_ha: number
) {
  for (let day = 0; day < 7; day++) {
    time_step(
      soc,
      flows,
      decomposition_rate,
      factors,
      "labile_microbial_biomass"
    );
    total_co2_kg_c_ha += flows.co2.labile_microbial_biomass;

    annual_co2_kg_c_ha += flows.co2.labile_microbial_biomass;

    soc.stable_microbial_biomass += flows.biomass.labile_microbial_biomass;
    soc.humus_organic_carbon += flows.humus.labile_microbial_biomass;
    soc.labile_microbial_biomass -= flows.soc.labile_microbial_biomass;
  }
  return { total_co2_kg_c_ha, annual_co2_kg_c_ha };
}

function time_step(
  soc: Pool,
  flows: { soc: Pool; co2: Pool; humus: Pool; biomass: Pool },
  decomposition_rate: Pool,
  factors: factors_type,
  key: organic_matter_type
) {
  flows.soc[key] =
    decomposition_rate[key] * factors.moisture * factors.temperature * soc[key];
  flows.co2[key] =
    flows.soc[key] * (1 - factors.proportion_of_carbon_to_organics);
  flows.humus[key] = flows.soc[key] * factors.PROPORTION_OF_ORGANICS_TO_HUMUS;
  flows.biomass[key] = flows.soc[key] - flows.co2[key] - flows.humus[key];
}
