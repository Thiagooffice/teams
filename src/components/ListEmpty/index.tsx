import { Container, Mensage } from "./styles";

type Props = {
    message: string
}

export function ListEmpty({message}: Props){
    return(
        <Container>
            <Mensage>
                {message}
            </Mensage>
        </Container>
    )
}