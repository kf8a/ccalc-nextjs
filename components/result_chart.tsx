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
): any[] {
  const resultArray: any[] = [];

  if (inputArray.length === 0) {
    return resultArray;
  }

  for (const key of keys) {
    const newObj: any = { name: key["label"] };

    for (let i = 0; i < inputArray.length; i++) {
      newObj[inputArray[i].title] = round(
        display_in_unit_system(
          inputArray[i].results.reduce((a, b) => a + b[key["name"]], 0) /
            inputArray[i].results.length,
          unit_system
        ),
        2
      );
    }

    resultArray.push(newObj);
  }

  return resultArray;
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
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
  console.log(props.results);
  console.log(data);

  return (
    <div className="p-8">
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
          <Legend />
          {key_values.map((key, index) => (
            <Bar key={key} dataKey={key} fill={props.colors[index]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
