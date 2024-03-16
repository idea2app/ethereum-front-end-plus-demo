import { FormEvent, useState } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"

export interface SearchMbtiProps extends Partial<Record<"userAddress" | "mbti", string>> {
  onSearch?: (address: string) => any
}

export const SearchMbti = ({ userAddress, mbti, onSearch }: SearchMbtiProps) => {
  const [address, setAddress] = useState<string>("");

  const handleSubmit = (event: FormEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();

    onSearch?.(address);
  }

  return <>
    <Row as={Form} className="mt-4 mb-3" onSubmit={handleSubmit}>
      <Col xs={9}>
        <Form.Control value={address} onChange={({ target: { value } }) => setAddress(value)} />
      </Col>
      <Col xs={3}>
        <Button className="w-100" type="submit">查询</Button>
      </Col>
    </Row>
    {userAddress && mbti && <Row className="mb-5">
      <Col> {userAddress} </Col>
      <Col className="text-end"> {mbti} </Col>
    </Row>}
  </>
}