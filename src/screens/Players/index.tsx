import { Highlight } from "@components/Highlight";
import { Header } from "@components/Header";
import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";
import { ButtonIcon } from '@components/ButtonIcon'
import { Input } from "@components/Input";
import { Filter } from "@components/Filter";
import { Alert, FlatList } from "react-native";
import { useState } from "react";
import { PlayerCard } from "@components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";
import { useRoute } from "@react-navigation/native";
import { AppError } from "@utils/AppError";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playersGetByGroupAndTeam } from "@storage/player/playerGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";

type RouteParams = {
    group: string
}


export function Players() {
    const [newPlayerName, setNewPlayerName] = useState("")
    const [team, setTeam] = useState("Time A")
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([])

    const route = useRoute();
    const { group } = route.params as RouteParams

    async function handleAddPlayer() {
        if (newPlayerName.trim().length === 0) {
            return Alert.alert("Nova pessoa", "Informe o nome da pessoa para adicionar")
        }

        const newPlayer = {
            name: newPlayerName,
            team,
        }

        try {
            await playerAddByGroup(newPlayer, group);
        } catch (error) {
            if (error instanceof AppError) {
                Alert.alert("Nova pessoa", error.message)
            } else {
                console.log(error);
                Alert.alert("Nova pessoa", "Não foi possível adicionar")
            }
        }
    }

    async function fetchPlayersByTeam(){
        try {
            const playersbyTeam = await playersGetByGroupAndTeam(group, team)
            setPlayers(playersbyTeam)
        } catch (error) {
            console.log(error);
            Alert.alert("Pessoas", "Não foi possível carregar as pessoas filtradas do time selecionado")
        }
    }

    return (
        <Container>
            <Header showBackButton />

            <Highlight
                title={group}
                subtitle="Adicione a galera e separe os times"
            />
            <Form>
                <Input
                    placeholder="Nome da pessoa"
                    autoCorrect={false}
                    onChangeText={setNewPlayerName}
                />
                <ButtonIcon
                    icon="add"
                    onPress={handleAddPlayer}
                />
            </Form>

            <HeaderList>
                <FlatList
                    data={["Time A", "Time B"]}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <Filter
                            title={item}
                            isActive={item === team}
                            onPress={() => setTeam(item)}
                        />
                    )}
                    horizontal
                />

                <NumberOfPlayers>
                    {players.length}
                </NumberOfPlayers>
            </HeaderList>

            <FlatList
                data={players}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <PlayerCard
                        name={item}
                        onRemove={() => { }}
                    />
                )}
                ListEmptyComponent={() => (
                    <ListEmpty
                        message="Não há pessoas nesse time."
                    />
                )}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                    { paddingBottom: 100 },
                    players.length === 0 && { flex: 1 }
                ]}
            />

            <Button
                title="Remover turma"
                type="SECONDARY"
            />
        </Container>
    )
}