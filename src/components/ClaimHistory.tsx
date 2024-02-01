import { FC } from "react";

export interface ClaimHistoryProps {
  record: string[];
}

export const ClaimHistory: FC<ClaimHistoryProps> = ({ record }) => {
  const hasMbtiNow = !!record[record.length - 1]

  return <>
    <h2 className="text-center mt-1">历史</h2>
    <ol reversed className="list-unstyled">
      {record
        .toReversed()
        .map((item, index, arr) => <li key={index} className="text-center">
          <span className="me-2">
            {arr.length - index}
            {index === 0 && hasMbtiNow && <sup className="text-danger">*</sup>}.
          </span>
          {item || "销毁"}
        </li>)}
    </ol>
  </>
}