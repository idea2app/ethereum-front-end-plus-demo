import { FC } from "react"
import { Button, Col, Row } from "react-bootstrap"

export interface LoginLogoutProps
  extends Partial<Record<"onLogin" | "onLogout", () => any>> {
  address?: string
}

export const LoginLogout: FC<LoginLogoutProps> = ({ address, onLogin, onLogout }) =>
  address
    ? <Row>
      <Col>{address}</Col>
      <Col as={Button} variant="danger" className="w-100" onClick={onLogout}>
        退出
      </Col>
    </Row>
    : <Button className="w-100" onClick={onLogin}>
      登录
    </Button>
