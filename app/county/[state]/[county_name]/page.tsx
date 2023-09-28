import { StrictMode } from "react";

import Database from "better-sqlite3";
import CountyModel from "@/components/county_model";
import { initial_model, County } from "@/lib/model";
import { mm_to_inch, c_to_f, round } from "@/lib/units";

interface CountyData {
  state: string;
  county_name: string;
}

function normalize_yields(county_yields: any) {
  let my_yields = {
    wheat: 0,
    oats: 0,
    corn: 0,
    silage: 0,
    soybean: 0,
    alfalfa: 0,
  };
  for (let row of county_yields) {
    switch (row.crop_id) {
      case 1:
        my_yields["wheat"] = row.yield;
        break;
      case 2:
        my_yields["oats"] = row.yield;
        break;
      case 3:
        my_yields["corn"] = row.yield;
      case 5:
        my_yields["silage"] = row.yield;
      case 6:
        my_yields["soybean"] = row.yield;
      case 7:
        my_yields["alfalfa"] = row.yield;
    }
  }
  return my_yields;
}

const db = new Database("michigan.sqlite3");

export async function generateStaticParams(): Promise<CountyData[]> {
  const rows = db
    .prepare(
      "SELECT distinct state as state, name as county_name FROM counties where state is not null and name is not null"
    )
    .all();

  // { state: 'CA', county_name: 'Modoc                         ' },
  let mapped_counties: CountyData[] = rows.map((county: any) => ({
    state: county.state,
    county_name: county.county_name.trim().replace(/ /, "_"),
  }));

  return mapped_counties;
}

export default function Page({
  params,
}: {
  params: { state: string; county_name: string };
}) {
  const state = params.state;
  const county_name = params.county_name;

  const current_county: County = db
    .prepare("Select * from counties where state = ? and name like ?")
    .get(state, `${decodeURI(county_name)}%`) as County;

  current_county.c_zero = current_county.c_zero / 2;
  current_county.bulk_density = round(current_county.bulk_density, 1);
  current_county.precipitation = round(
    mm_to_inch(current_county.precipitation),
    2
  );
  current_county.t_min = round(c_to_f(current_county.t_min), 1);
  current_county.t_max = round(c_to_f(current_county.t_max), 1);
  current_county.clay = round(current_county.clay, 1);

  const current_model = { ...initial_model, county: current_county };

  // get default yields
  const raw_yields = db
    .prepare(
      "with t1 as (SELECT crop_id, year, commodity, yield, field_unit FROM county_yields where county_id = ?  order by year desc) select * from t1 group by commodity"
    )
    .all(current_county.id);

  const county_yields = normalize_yields(raw_yields);

  // TODO: set default yields
  current_model.scenarios[0].rotations[0].crop_yield = county_yields.corn;
  current_model.scenarios[0].rotations[1].crop_yield = county_yields.soybean;

  return (
    <StrictMode>
      <CountyModel
        my_state={state}
        county_name={county_name}
        default_yields={county_yields}
        initial_model={current_model}
      />
    </StrictMode>
  );
}
