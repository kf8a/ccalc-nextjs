import { socrates } from "../lib/socrates";

let rotations = [
  {
    year: 0,
    crop_name: "corn",
    crop_yield: 9219.84,
    nitrogen: 159.04000000000002,
    tillage: "conventional",
  },
];

let county = {
  clay: 17,
  t_max: 11.6,
  t_min: -3.1,
  bulk_density: 1.5,
  c_zero: 0.5,
  precipitation: 301,
};

test("socrates", () => {
  expect(socrates(rotations, county, 1)).toBe([
    {
      annual_co2_kg_c_ha: 45.739355020317454,
      c_zero: 0.5,
      decomposable_plant_material: 1019.2694011724101,
    },
  ]);
});
