import React from "react";
import { Tooltip } from "@nextui-org/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default function StyledTooltip(props: { label: string; info: string }) {
  return (
    <Tooltip className="w-60" content={props.info}>
      <div className="flex flex-row">
        {props.label} <InformationCircleIcon className="ml-2 w-4 h-4" />
      </div>
    </Tooltip>
  );
}
