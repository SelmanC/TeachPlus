import React from 'react';
import { View, ScrollView } from 'react-native';
import { Badge } from 'react-native-elements';

export const BadgeListView = ({ selectedItems, onPressed }) => {
    return (
        <View style={{ height: 50, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <ScrollView horizontal bounces={false} >
                {
                    selectedItems.length > 0 &&
                    selectedItems.map((p, key) => (
                        <Badge
                            key={key}
                            value={p.name}
                            containerStyle={{ marginLeft: 5, height: 40, backgroundColor: '#4C3E54' }}
                            textStyle={{ fontSize: 16 }}
                            onPress={() => onPressed(p, key)}
                        />
                    ))
                }
            </ScrollView>
        </View >
    );
};
