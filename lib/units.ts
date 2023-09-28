import {
  unit_system_type,
  crop,
  scenario_info,
  rotation_info,
  County,
} from "./model";

export function metric_tons_per_ha_to_imperial_tons_per_acre(value: number) {
  return value * 0.4;
}

export function display_in_unit_system(
  value: number,
  unit_system: unit_system_type
) {
  if (unit_system === "metric") {
    return round(value, 2);
  } else {
    return round(metric_tons_per_ha_to_imperial_tons_per_acre(value), 2);
  }
}

export function display_unit(unit_system: unit_system_type) {
  if (unit_system === "metric") {
    return "Mg/ha";
  } else {
    return "tons/ac";
  }
}

export function round(value: number, decimals: number) {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export function county_to_metric(
  county: County,
  unit_system: unit_system_type
) {
  let new_county = structuredClone(county);
  if (unit_system == "metric") {
    return new_county;
  } else if (unit_system == "imperial") {
    new_county.t_min = f_to_c(county.t_min);
    new_county.t_max = f_to_c(county.t_max);
    new_county.precipitation = inch_to_mm(county.precipitation);
    return new_county;
  } else {
    throw new Error(`Invalid unit system: ${unit_system}`);
  }
}

export function rotations_to_metric(
  rotations: rotation_info[],
  unit_system: unit_system_type
) {
  let new_rotations = structuredClone(rotations);

  if (unit_system == "metric") {
    new_rotations.forEach((rotation) => {
      rotation.crop_yield = rotation.crop_yield * 1000;
    });
    return new_rotations;
  } else {
    new_rotations.forEach((rotation) => {
      rotation.crop_yield =
        crop_yield_to_metric(rotation.crop_yield, rotation.crop_name) * 1000;
      rotation.nitrogen = lb_acre_to_kg_ha(rotation.nitrogen);
    });
    return new_rotations;
  }
}

function lb_acre_to_kg_ha(lb_acre: number) {
  return lb_acre * 1.12;
}

function kg_ha_to_lb_acre(kg_ha: number) {
  return kg_ha / 1.12;
}

export function scenario_to_metric(scenario: scenario_info) {
  scenario.rotations.forEach((rotation) => {
    rotation.crop_yield = crop_yield_to_metric(
      rotation.crop_yield,
      rotation.crop_name
    );
    rotation.nitrogen = lb_acre_to_kg_ha(rotation.nitrogen);
  });
  return scenario;
}

export function scenario_to_imperial(scenario: scenario_info) {
  scenario.rotations.forEach((rotation) => {
    rotation.crop_yield = crop_yield_to_imperial(
      rotation.crop_yield,
      rotation.crop_name
    );
    rotation.nitrogen = kg_ha_to_lb_acre(rotation.nitrogen);
  });
  return scenario;
}

export function crop_yield_to_metric(crop_yield: number, crop: crop): number {
  switch (crop) {
    case "corn":
      crop_yield = crop_yield * 56 * 1.12;
      break;
    case "soybean":
    case "wheat":
    case "oats":
      crop_yield = crop_yield * 60 * 1.12;
      break;
    case "silage":
    case "switchgrass":
      crop_yield = (crop_yield * 1000) / 0.446;
      break;
    default:
  }
  return crop_yield / 1000;
}

export function crop_yield_to_imperial(crop_yield: number, crop: crop) {
  crop_yield = crop_yield * 1000;
  switch (crop) {
    case "corn":
      crop_yield = crop_yield / 1.12 / 56;
      break;
    case "soybean":
    case "wheat":
    case "oats":
      crop_yield = crop_yield / 1.12 / 60;
      break;
    case "silage":
    case "switchgrass":
      crop_yield = (crop_yield / 1000) * 0.446;
      break;
    default:
  }
  return crop_yield;
}

export function county_in_unit_system(
  county: County,
  unit_system: unit_system_type
): County {
  if (unit_system == "metric") {
    return county;
  } else {
    let my_county = structuredClone(county);

    my_county.t_min = f_to_c(county.t_min);
    my_county.t_max = f_to_c(county.t_max);
    my_county.precipitation = inch_to_mm(county.precipitation);
    return my_county;
  }
}

export function stringToUnitSystemType(str: string): unit_system_type {
  if (str === "imperial") {
    return "imperial";
  } else if (str === "metric") {
    return "metric";
  } else {
    throw new Error(`Invalid unit system: ${str}`);
  }
}

export function f_to_c(temperature: number) {
  return ((temperature - 32) * 5) / 9;
}

export function c_to_f(temperature: number) {
  return (temperature * 9) / 5 + 32;
}

export function inch_to_mm(precip: number) {
  return precip * 25.4;
}

export function mm_to_inch(precip: number) {
  return precip / 25.4;
}

export function results_to_imperial(value: number) {
  return 0.4 * value;
}

// var metrify_scenario = function(rotations) {
// 	var s = $.extend(true,[], rotations)

// 	if ($.modelGet('/units') == 'metric') {

// 		for(var i = 0; i < s.length; i++) {
// 			var r = s[i];
// 			if (r==undefined) {
// 				continue;
// 			}
// 			r.yield = r.yield * 1000;
// 		}

// 	} else {

// 		for (var i = 0; i <s.length; i++) {
// 			var r = s[i];
// 			if (r == undefined) {
// 				continue;
// 			}
// 			r.nitrogen = r.nitrogen * 1.12;
// 			switch(r.crop_id) {
// 				case 'corn':
// 					r.crop_yield = r.yield * 56 * 1.12;
// 				break
// 			case 'soybean':
// 			case 'wheat':
// 				r.crop_yield = r.crop_yield * 60 * 1.12;
// 				break
// 			case 'switchgrass':
// 			case 'silage':
// 				r.crop_yield = r.crop_yield * 907.18474 * 0.65;
// 				break;
// 			default:
// 			}
// 		}
// 	}
// 	return s;

// }
