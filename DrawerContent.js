import React from 'react';
import { View, StyleSheet, Image} from 'react-native';
import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch,
    List,
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export function DrawerContent(props){

    var ticketCategoryTheme = {
        colors: {
            primary: 'rgb(0,97,167)',
            background: 'white',
        },
    };

    return (
        <View style={{flex: 1}}>
            <DrawerContentScrollView>
                <View style={{flexDirection: 'row', marginLeft: 15, alignItems: 'center',}}>
                    <Image style={{
                        width: 45,
                        height: 45,
                    }} source={require('./images/default_user_icon.png')}/>
                    <View style={{flexDirection: 'column', marginLeft: 15,}}>
                        <Title>John Doe</Title>
                        <Caption>john.doe@gmail.com</Caption>
                    </View>
                </View>
                <Drawer.Section>
                    <DrawerItem
                        label='Home'
                        onPress={()=>props.navigation.navigate('Home')}
                    />
                    <List.Accordion 
                        title='Corporate Secretarial'
                        theme={ticketCategoryTheme}>
                        <DrawerItem 
                            label='Subsidiary 1 Support'
                            onPress={()=>props.navigation.navigate('Subsidiary 1 Support')}
                        />
                    </List.Accordion>
                    <List.Accordion
                        title='Client Due Diligence'
                        theme={ticketCategoryTheme}>
                        <DrawerItem 
                            label='Subsidiary 1 CDD'
                            onPress={()=>props.navigation.navigate('Subsidiary 1 CDD')}
                        />
                    </List.Accordion>
                    <List.Accordion
                        title='Accounts'
                        theme={ticketCategoryTheme}>
                        <DrawerItem 
                            label='Subsidiary 1 Accounts'
                            onPress={()=>props.navigation.navigate('Subsidiary 1 Accounts')}
                        />    
                    </List.Accordion>
                    <List.Accordion
                        title='Accounts Receivables'
                        theme={ticketCategoryTheme}>
                        <DrawerItem 
                            label='Subsidiary 1 SOA'
                            onPress={()=>props.navigation.navigate('Subsidiary 1 SOA')}
                        /> 
                    </List.Accordion>
                    <List.Accordion
                        title='Immigration'
                        theme={ticketCategoryTheme}>
                        <DrawerItem
                            label='Subsidiary 1 Migration'
                            onPress={()=>props.navigation.navigate('Subsidiary 1 Migration')}
                        />
                    </List.Accordion>
                    <List.Accordion
                        title='Tax'
                        theme={ticketCategoryTheme}>
                        <DrawerItem
                            label='Subsidiary 1 Tax'
                            onPress={()=>props.navigation.navigate('Subsidiary 1 Tax')}
                        />
                    </List.Accordion>
                </Drawer.Section>
            </DrawerContentScrollView>
        </View>
    );
}
const styles = StyleSheet.create({

});