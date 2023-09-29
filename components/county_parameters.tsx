import { County, unit_system_type } from "@/lib/model";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Tooltip,
} from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import StyledTooltip from "../components/styled_tooltip";

const stateAbbreviationsToNames = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

function temperature_units_in_system(system: unit_system_type) {
  return system === "metric" ? "C" : "F";
}
function precipitation_units_in_system(system: unit_system_type) {
  return system === "metric" ? "mm" : "in";
}

export default function CountyParameters(props: {
  county: County;
  unit_system: unit_system_type;
  updater: any;
}) {
  const state_name =
    stateAbbreviationsToNames[
      props.county.state as keyof typeof stateAbbreviationsToNames
    ];
  const county_link = `https://en.wikipedia.org/wiki/${props.county.name}_County,_${state_name}`;

  const temperature_units = temperature_units_in_system(props.unit_system);
  const precip_units = precipitation_units_in_system(props.unit_system);

  https: return (
    <Card className="m-4 max-w-[600px]">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md font-bold">
            {props.county.name} County, {props.county.state}
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="grid grid-cols-2 gap-4">
          <StyledTooltip
            label="Precipitation"
            info="Average annual total precipitation based on data from the National Weather Service for the period 1972-1990."
          />
          <div className="flex flex-row w-40">
            <Input
              type="number"
              aria-label="Precipitation"
              value={props.county.precipitation.toString()}
              onValueChange={(e) => props.updater("precipitation", e)}
            />
            <span className="px-4">{precip_units}</span>
          </div>
          <StyledTooltip
            label="Minimum Temperature"
            info="Average annual maximum and minimum temperature based on data from the National Weather Service for the period 1972-1990."
          />
          <div className="flex flex-row w-40">
            <Input
              type="number"
              aria-label="Minimum Temperature"
              value={props.county.t_min.toString()}
              onValueChange={(e) => props.updater("t_min", e)}
            />
            <span className="px-4">{temperature_units}</span>
          </div>
          <StyledTooltip
            label="Maximum Temperature"
            info="Average annual maximum and minimum temperature based on data from the National Weather Service for the period 1972-1990."
          />
          <div className="flex flex-row w-40">
            <Input
              type="number"
              aria-label="Maximum Temperature"
              value={props.county.t_max.toString()}
              onValueChange={(e) => props.updater("t_max", e)}
            />
            <span className="px-4">{temperature_units}</span>
          </div>
          <StyledTooltip
            label="Percent Clay"
            info="Percent clay in the upper few inches of soil (A horizon). Clay content affects soil aeration and the soil's ability to hold water. Clay soils can hold more water, but too much moisture will reduce oxygen levels, which will slow the microbes responsible for decomposition and stimulate N2O emissions."
          />
          <div className="flex flex-row w-40">
            <Input
              type="number"
              aria-label="Percent Clay"
              min={0}
              max={100}
              value={props.county.clay.toString()}
              onValueChange={(e) => props.updater("clay", e)}
            />
            <span className="px-4">%</span>
          </div>
          <StyledTooltip
            label="Carbon"
            info="Percent carbon in the upper few inches of soil (A horizon). Soil carbon is part of soil organic matter, which is comprised of decomposing plants, animals, and microbes."
          />
          <div className="flex flex-row w-40">
            <Input
              type="number"
              aria-label="Percent Carbon"
              min={0}
              max={100}
              value={props.county.c_zero.toString()}
              onValueChange={(e) => props.updater("c_zero", e)}
            />
            <span className="px-4">%</span>
          </div>
          <StyledTooltip
            label="Bulk Density"
            info="Bulk density is the mass of a given volume of soil, and is a measure of soil compaction. Compacted soils are more likely to experience oxygen depletion, which
 will slows the microbes responsible for decomposition and stimulate N2O emissions."
          />
          <div className="flex flex-row w-40">
            <Input
              type="number"
              aria-label="Bulk Density"
              min={0}
              max={3}
              value={props.county.bulk_density.toString()}
              onValueChange={(e) => props.updater("bulk_density", e)}
            />
            <span className="px-4">
              g/cm<sup>3</sup>
            </span>
          </div>
        </div>
      </CardBody>
      <Divider />
      <CardFooter>
        <Link isExternal showAnchorIcon href={county_link}>
          Visit County on Wikipedia
        </Link>
      </CardFooter>
    </Card>
  );
}
