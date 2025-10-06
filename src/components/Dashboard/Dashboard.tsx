// components/dashboard.jsx
import React from 'react';
// @ts-ignore
import { Box, H2, Text, Section } from '@adminjs/design-system';

const Dashboard = ({props}: { props: any }) => {
    const { data } = props;

    return (
        <Box>
            <H2>Панель управления Новостным порталом</H2>
            <Section>
                <Box display="flex" flexDirection="row" flexWrap="wrap">
                    <Box width={1/2} p="xl">
                        <Text variant="lg">Пользователи: {data.users}</Text>
                    </Box>
                    <Box width={1/2} p="xl">
                        <Text variant="lg">Новости: {data.news}</Text>
                    </Box>
                    <Box width={1/2} p="xl">
                        <Text variant="lg">Комментарии: {data.comments}</Text>
                    </Box>
                    <Box width={1/2} p="xl">
                        <Text variant="lg" color="error">Ожидают модерации: {data.pendingComments}</Text>
                    </Box>
                </Box>
            </Section>
        </Box>
    );
};

export default Dashboard;