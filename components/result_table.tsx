import { results_type, unit_system_type } from "@/lib/model";
import { round, display_in_unit_system, display_unit } from "@/lib/units";
import {
  Table,
  TableBody,
  TableHeader,
  TableCell,
  TableRow,
  TableColumn,
  getKeyValue,
} from "@nextui-org/react";
import StyledTooltip from "./styled_tooltip";
const table_columns = [
  { key: "id", label: "Year" },
  { key: "soil_co2_estimate", label: "Soil" },
  { key: "fertilizer_co2_estimate", label: "N2O" },
  { key: "fuel_co2_estimate", label: "Fuel" },
  { key: "fertilizer_production", label: "Fertilizer" },
  { key: "balance", label: "Total" },
];

export default function ResultTable(props: {
  results: Array<results_type>;
  unit_system: unit_system_type;
}) {
  const rows = props.results;
  return (
    <div>
      <h2 className="text-lg p-2">
        <StyledTooltip
          label={`Greenhouse gas costs CO2 equivalents ${display_unit(
            props.unit_system
          )}/yr`}
          info="Greenhouse gas costs, in CO2-equivalents, represent the contribution of each crop to atmospheric warming. Positive values add radiative forcing to the atmosphere. Negative values remove warming potential. The difference between two management systems indicates the net cost or benefit of one management system versus another."
        />
      </h2>
      <Table aria-label="rotations table">
        <TableHeader>
          <TableColumn>Year</TableColumn>
          <TableColumn>
            <StyledTooltip
              label="Soil"
              info="Changes in soil carbon storage represent the difference between the carbon that is added to the soil from crop residues and roots each year and the carbon that is transformed to CO2 by microbes and other soil organisms."
            />
          </TableColumn>
          <TableColumn>
            <StyledTooltip
              label="N2O"
              info="Nitrous oxide (N2O) is emitted by soil bacteria, and is about 300 times better at capturing heat than is CO2.  N2O emissions are related to the amount of nitrogen added to the cropping system from fertilizers and nitrogen-fixing plants such as soybeans and alfalfa."
            />
          </TableColumn>
          <TableColumn>
            <StyledTooltip
              label="Fuel"
              info="Fuel use represents a carbon cost in farming. Carbon dioxide is produced by the combustion of diesel fuel to run tractors and other farm machinery during field operations."
            />
          </TableColumn>
          <TableColumn>
            <StyledTooltip
              label="Fertilizer"
              info="When nitrogen fertilizer is manufactured, CO2 is a by-product. This term represents the amount of CO2 produced during the manufacturing process."
            />
          </TableColumn>
          <TableColumn>Total</TableColumn>
        </TableHeader>
        <TableBody>
          // @ts-ignore
          {rows.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>
                {display_in_unit_system(
                  item.soil_co2_estimate,
                  props.unit_system
                )}
              </TableCell>
              <TableCell>
                {display_in_unit_system(
                  item.fertilizer_co2_estimate,
                  props.unit_system
                )}
              </TableCell>
              <TableCell>
                {display_in_unit_system(
                  item.fuel_co2_estimate,
                  props.unit_system
                )}
              </TableCell>
              <TableCell>
                {display_in_unit_system(
                  item.fertilizer_production,
                  props.unit_system
                )}
              </TableCell>
              <TableCell>
                {display_in_unit_system(
                  item.soil_co2_estimate +
                    item.n2o_n_estimate_percentage +
                    item.fuel_co2_estimate +
                    item.fertilizer_production,
                  props.unit_system
                )}
              </TableCell>
            </TableRow>
          ))}
          ;
          <TableRow>
            <TableCell>Annual Average</TableCell>
            <TableCell>
              {display_in_unit_system(
                rows.reduce((a, b) => a + b.soil_co2_estimate, 0) / rows.length,
                props.unit_system
              )}
            </TableCell>
            <TableCell>
              {display_in_unit_system(
                rows.reduce((a, b) => a + b.fertilizer_co2_estimate, 0) /
                  rows.length,
                props.unit_system
              )}
            </TableCell>
            <TableCell>
              {display_in_unit_system(
                rows.reduce((a, b) => a + b.fuel_co2_estimate, 0) / rows.length,
                props.unit_system
              )}
            </TableCell>
            <TableCell>
              {display_in_unit_system(
                rows.reduce((a, b) => a + b.fertilizer_production, 0) /
                  rows.length,
                props.unit_system
              )}
            </TableCell>
            <TableCell>
              {display_in_unit_system(
                rows.reduce(
                  (a, b) =>
                    a +
                    b.soil_co2_estimate +
                    b.fertilizer_co2_estimate +
                    b.fuel_co2_estimate +
                    b.fertilizer_production,
                  0
                ) / rows.length,
                props.unit_system
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
