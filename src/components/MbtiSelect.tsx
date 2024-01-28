import { FC } from "react";
import { Col, Form, Row } from "react-bootstrap";

import { convertMbtiToDecimalNumber, convertMbtiToString, MBTI_TYPE } from "../utils/mbti";

interface MbtiSelectProps {
  mbti?: number;
  onChange?: (mbti: number) => any;
}

export const MbtiSelect: FC<MbtiSelectProps> = ({ mbti = 0, onChange }) => {
  const mbtiItemArr = convertMbtiToString(mbti < 0 || mbti > 15 ? 0 : mbti).split("");

  const handleChangeType = (typeIndex: number, item: string) => onChange?.(
    convertMbtiToDecimalNumber(
      mbtiItemArr.reduce((pre, cur, index) =>
        pre + (index === typeIndex ? item : cur), "")
    )
  )

  return <Row className="my-2">
    {MBTI_TYPE.map((typeItem, typeIndex) =>
      <Col key={typeItem.toString()}>
        <Form.Select
          value={mbtiItemArr[typeIndex]}
          onChange={({ target: { value } }) => handleChangeType(typeIndex, value)}
        >
          {typeItem.map(item => <option key={item}>{item}</option>)}
        </Form.Select>
      </Col>
    )}
  </Row>
}