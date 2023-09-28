"use client";
import React from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import {
  results_type,
  scenario_result_type,
  unit_system_type,
} from "@/lib/model";
import {
  round,
  display_in_unit_system,
  display_unit,
  stringToUnitSystemType,
} from "@/lib/units";

const keys = [
  { name: "soil_co2_estimate", label: "Soil" },
  { name: "fertilizer_co2_estimate", label: "N2O" },
  { name: "fuel_co2_estimate", label: "Fuel" },
  { name: "fertilizer_production", label: "Fertilizer" },
];

function convertArray(
  inputArray: scenario_result_type[],
  unit_system: unit_system_type
): ScenarioObject[] {
  const resultArray: any[] = [];

  if (inputArray.length === 0) {
    return resultArray;
  }

  for (const key of keys) {
    const newObj: any = { name: key["label"] };

    for (let i = 0; i < inputArray.length; i++) {
      newObj[inputArray[i].title] = round(
        display_in_unit_system(
          // @ts-ignore
          inputArray[i].results.reduce((a: number, b) => a + b[key.name], 0) /
            inputArray[i].results.length,
          unit_system
        ),
        2
      );
    }

    resultArray.push(newObj);
  }
  return calculateTotal(resultArray);
}

interface ScenarioObject {
  // @ts-ignore
  name: string;
  [scenario: string]: number;
}

function calculateTotal(scenarioObjects: ScenarioObject[]): ScenarioObject[] {
  // @ts-ignore
  const total: Partial<ScenarioObject> = {
    name: "Total",
  };

  const scenarios = Object.keys(scenarioObjects[0]).filter(
    (key) => key !== "name"
  );

  for (const scenario of scenarios) {
    let sum = 0;
    for (const obj of scenarioObjects) {
      sum += obj[scenario];
    }
    total[scenario] = round(sum, 2);
  }

  return [...scenarioObjects, total as ScenarioObject];
}

// const keys = ["rotation_0", "rotation_1"];
export default function ResultChart(props: {
  results: scenario_result_type[];
  unit_system: unit_system_type;
  colors: string[];
}) {
  let key_values = props.results.map((scenario) => scenario.title);
  let unit_system = stringToUnitSystemType(props.unit_system);
  let data = convertArray(props.results, unit_system);

  return (
    <div className="p-8 dark:bg-slate-900 dark:text-white bg-white text-slate-900">
      <h4>Annual Average CO2 costs</h4>
      <span>{`${display_unit(unit_system)}/year`}</span>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          width={600}
          height={300}
          data={convertArray(props.results, unit_system)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <ReferenceLine y={0} stroke="black" strokeWidth={2} />
          <Legend />
          {key_values.map((key, index) => (
            <Bar key={key} dataKey={key} fill={props.colors[index]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
