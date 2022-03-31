import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Dimensions, Image, ScrollView, TouchableOpacityBase} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator} from '@react-navigation/drawer';
import { configureFonts, List } from 'react-native-paper';
import Constants from 'expo-constants';
import { DrawerContent } from './DrawerContent';
import Collapsible from 'react-native-collapsible';
import DropDownPicker from 'react-native-dropdown-picker';

const TICKET_DATA = {
	SAMPLE: 'Sorted ascSorted desc,ID#Sorted ascSorted desc,SubjectSorted ascSorted desc,RemarksSorted ascSorted desc,FromSorted ascSorted desc,Email DateSorted ascSorted desc,Replied BySorted ascSorted desc,Create DateSorted ascSorted desc,SourceSorted ascSorted desc,AssignToSorted ascSorted desc,FollowupSorted ascSorted desc,StatusSorted ascSorted desc,ElapseSorted ascSorted desc,PrioritySorted ascSorted desc\nDelete Ticket,100147,Demo 123 - [#CSS-100147],,123demo@gmail.com,12/8/2021 16:01,System,12-Aug-21,Email,Aloha,13-Aug-21,Open,40,Low\nDelete Ticket,100103,Demo Attachemnt - [#CSS-100103],,demo@yopmail.co,12/8/2021 14:18,System,4-Aug-21,Email,Prokorpmgmt,5-Aug-21,Draft,,\nDelete Ticket,100133,Demo 123 - [#CSS-100133],,123demo@yopmail.com,11/8/2021 22:55,System,11-Aug-21,Email,,12-Aug-21,Draft,,\nDelete Ticket,100138,Test Email - [#CSS-100138],,abc@gmail.com,11/8/2021 22:54,System,11-Aug-21,Email,,12-Aug-21,Draft,,\nDelete Ticket,100139,Test Email - [#CSS-100139],demo 4,abc@gmail.com,11/8/2021 22:13,System,11-Aug-21,Email,,12-Aug-21,Draft,,\nDelete Ticket,100140,Testing1 - [#CSS-100140],,abc@gmail.com,11/8/2021 21:24,System,11-Aug-21,Email,,12-Aug-21,Draft,,\nDelete Ticket,100146,Demo Test 12 - [#CSS-100146],,123demo@yopmail.com,11/8/2021 21:19,System,11-Aug-21,Email,,12-Aug-21,Open,41,\nDelete Ticket,100145,Demo Test 12 - [#CSS-100145],demo duplicate,123demo@yopmail.com,11/8/2021 21:19,System,11-Aug-21,Email,,12-Aug-21,Open,41,\nDelete Ticket,100144,Demo Test 12 - [#CSS-100144],,123demo@yopmail.com,11/8/2021 21:19,System,11-Aug-21,Email,,12-Aug-21,Open,41,\nDelete Ticket,100136,Demo1230 - [#CSS-100136],demo2 00,123demo@yopmail.com,11/8/2021 17:33,System,11-Aug-21,Email,,12-Aug-21,Draft,,\nDelete Ticket,100043,Test - [#CSS-100043],Why is this still pending?,liza@prokorp.sg,11/8/2021 17:09,System,21-May-21,Email,Adminneebal,22-May-21,Draft,,\nDelete Ticket,100135,Demo123 - [#CSS-100135],,123demo@yopmail.com,11/8/2021 17:08,System,11-Aug-21,Email,,12-Aug-21,Draft,,\nDelete Ticket,100134,Demo1234 - [#CSS-100134],,123demo@yopmail.com,11/8/2021 16:46,System,11-Aug-21,Email,,12-Aug-21,Draft,,\nDelete Ticket,100143,Demo 123 - [#CSS-100143],,123demo@yopmail.com,11/8/2021 16:42,System,11-Aug-21,Email,,12-Aug-21,Open,41,',
}
const TICKET_CATEGORIES = ['Subsidiary 1 Support', 'Subsidiary 1 CDD', 'Subsidiary 1 Accounts', 'Subsidiary 1 SOA', 'Subsidiary 1 Migration', 'Subsidiary 1 Tax'];

function parseCSVFile(csvData){
	return csvData.split('\n').map(line=>line.split(','));
}
function getTicketList(category, csvData){
	let ticketList = [];

	let flagColourList = ['', '', '', '', '', '', 'red', 'blue', 'yellow', 'green'];

	for (let i = 1; i < csvData.length; i++) {
		const ticket = {
			key: getRandomId(),
			id: csvData[i][1],
			fromEmail: csvData[i][4],
			subject: csvData[i][2],
			remarks: csvData[i][3],
			category: category || TICKET_CATEGORIES[Math.floor(Math.random()*TICKET_CATEGORIES.length)],
			status: csvData[i][11],
			emailDate: csvData[i][5],
			createDate: csvData[i][7],
			assignedTo: csvData[i][9],
			followup: csvData[i][10],
			elapse: csvData[i][12],
			priority: csvData[i][13],
			flagColour: flagColourList[Math.floor(Math.random()*flagColourList.length)],
		};
		ticketList.push(ticket);
	}
	return ticketList;
}
function getRandomId(){
	let id = '';
	for (let i = 0; i < 20; i++) {
		id += String.fromCharCode(65+Math.floor(Math.random() * 26));
	}
	return id;
}

// Global Icons

const ICONS = {
	Open: require('./images/status_icons/open.png'),
	Closed: require('./images/status_icons/closed.png'),
	Deleted: require('./images/status_icons/deleted.png'),
	Draft: require('./images/status_icons/draft.png'),
	Followup: require('./images/status_icons/followup.png'),
	'Work In Progress': require('./images/status_icons/workinprogress.png'),
	Transferred: require('./images/status_icons/transferred.png'),
	'Duplicate Ticket': require('./images/status_icons/duplicateticket.png'),
	AssignedTo: require('./images/assigned_to_icon.png'),
	PDF: require('./images/pdf_icon.png'),
	History: require('./images/history_icon.png'),
	DEFAULT_USER: require('./images/default_user_icon.png'),
	MENU: require('./images/menu_icon.png'),
	COLLAPSED: require('./images/collapsed_icon.png'),
	DOWNLOAD: require('./images/download_icon.png'),
	UPDATE: require('./images/update_icon.png'),
}

//Home Screen

class Ticket extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			...props,
			hasAttachments: Math.floor(Math.random()*2)==0,
			attachmentNumber: 0,
			historyIcon: 
				<TouchableOpacity onPress={()=>props.displayTicketNotes(this.state)}>
					<Image style={{
						width: 18,
						height: 18,
					}} source={ICONS.History}/>
				</TouchableOpacity>
			,
		}
	}
	componentDidMount(){
		try{
			let emailDateTime = this.state.emailDate.split(' ');
			let currentDate = `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`;
			if(emailDateTime[0] == currentDate){
				this.setState({emailDate: emailDateTime[1]});
			}
			else{
				var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
				var date = emailDateTime[0].split('/');
				date = `${date[0]} ${monthNames[parseInt(date[1])-1]} ${date[2]}`;
				this.setState({emailDate: date});
			}
		}
		catch{}

		if(this.state.hasAttachments){
			this.setState({attachmentNumber: Math.floor(Math.random() * 10)});
		}
	}
	componentWillUnmount(){

	}
	render(){
		return(
			<TouchableOpacity
				onPress={()=>this.props.displayTicketHistory(this.state)}>
				<View style={{...styles.ticket, borderTopColor: this.state.flagColour || '#e3e3e3', borderTopWidth: 5,}}>
					<View style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						marginBottom: 5,
					}}>
						<View style={{flexDirection: 'row', alignItems: 'center',}}>
							<Text style={{fontWeight: 'bold',}}>From: </Text>
							<Text style={{fontSize: 16,}}>{this.state.fromEmail}</Text>
						</View>
						<Text style={{fontSize: 14, fontStyle: 'italic', fontWeight: 'bold'}}>{this.state.emailDate}</Text>
					</View>
					<Text style={{fontSize: 16, marginBottom: 10,}}>{this.state.subject}</Text>
					{
						this.state.status in ICONS ? 

						<View style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between',
							marginBottom: 5,
						}}>
							<View style={{flexDirection: 'row', alignItems: 'center',}}>
								<Text style={{fontSize: 14, fontWeight: 'bold'}}>{this.state.status}</Text>
							</View>
							{
								<View style={{flexDirection: 'row', alignItems: 'center',}}>
									{
										this.state.isHomeScreen ? null : <Text style={{fontSize: 14, marginRight: 5,}}>{this.state.assignedTo}</Text>
									}
									<Image style={{
										width: 18,
										height: 18,
										marginRight: 5,
									}} source={ICONS.AssignedTo}/>
									{this.state.historyIcon}
								</View>
							}
						</View> 
						
						: null
					}
					{
						this.state.hasAttachments ? <View style={{
							flexDirection: 'row',
							alignItems: 'center',
						}}>
							<View style={{
								flexDirection: 'row',
								alignItems: 'center',
								paddingTop: 3,
								paddingBottom: 3,
								paddingLeft: 10,
								paddingRight: 10,
								marginTop: 5,
								marginBottom: 5,
								marginRight: 10,
								borderRadius: 15,
								borderWidth: 1,
								borderColor: '#e3e3e3',
							}}>
								<Image style={{
									width: 18,
									height: 18,
									marginRight: 5,
								}} source={ICONS.PDF}/>
								<Text style>test_attachment.pdf</Text>
							</View>
							{
								this.state.attachmentNumber > 0 ? <Text>+ {this.state.attachmentNumber}</Text> : null
							}
						</View>

						: null
					}
				</View>
			</TouchableOpacity>
		);
	}
}

// Ticket List

class TicketList extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			ticketList: [],
			isHomeScreen: props.isHomeScreen,
			category: props.category,
			categoryList: [],
			ticketCategories: {},
			searchText: '',
		}
		this.renderItem = this.renderItem.bind(this);
		this.renderCategory = this.renderCategory.bind(this);
		this.displayTicketHistory = this.displayTicketHistory.bind(this);
		this.displayTicketNotes = this.displayTicketNotes.bind(this);
	}
	componentDidMount(){
		this.navigation = this.props.navigation;

		var ticketList = getTicketList(this.state.category, parseCSVFile(TICKET_DATA.SAMPLE));
		this.setState({ticketList});
		// console.log(ticketList.length, this.state.ticketList.length);

		var categoryList = Array.from(new Set(ticketList.map(ticket=>ticket.category)));
		this.setState({categoryList});
		// console.log(categoryList.length, this.state.categoryList.length);

		// console.log('Category List: ', categoryList);

		var ticketCategories = {}

		try{
			categoryList.map(category=>{
				ticketCategories[category] = ticketList.filter(ticket=>ticket.category==category);
			});

			this.setState({ticketCategories: ticketCategories});
		}
		catch{}
	}
	componentWillUnmount(){

	}
	displayTicketHistory(ticketData){
		this.navigation.navigate({
			name: 'TicketHistory',
			params: {
				ticketData: JSON.stringify(ticketData),
			},
		});
	}
	displayTicketNotes(ticketData){
		this.navigation.navigate({
			name: 'TicketNotes',
			params: {
				ticketData: JSON.stringify(ticketData),
			},
		});
	}
	renderItem({item}){
		return <Ticket {...item} displayTicketHistory={this.displayTicketHistory} displayTicketNotes={this.displayTicketNotes} navigation={this.navigation} isHomeScreen={this.state.isHomeScreen}/>
	}
	renderCategory({item: category}){
		var ticketList = this.state.ticketCategories[category];
		return <TicketCategory displayTicketHistory={this.displayTicketHistory} displayTicketNotes={this.displayTicketNotes} category={category} ticketList={ticketList}/>
	}
	render(){
		return(
			<View>
				{
					this.state.isHomeScreen ?
					
					<View>
						<Text style={{
							fontSize: 24,
							fontWeight: 'bold',
							padding: 15,
							}}>
							Assigned Tickets ({this.state.ticketList.length})
						</Text>
						<FlatList
							style={styles.ticketList}
							data={this.state.categoryList}
							renderItem={this.renderCategory}
							keyExtractor={item=>getRandomId()}
						/>
					</View>
					
					:

					<View>
						<TextInput
							style={{
								padding: 5,
								borderWidth: 1,
								borderRadius: 5,
								borderColor: '#e3e3e3',
							}}
							onChangeText={text=>this.setState({searchText: text})}
							value={this.state.searchText}
							placeholder='Search'
						/>
						<FlatList
							style={styles.ticketList}
							data={this.state.ticketList}
							renderItem={this.renderItem}
							keyExtractor={item=>item.key}
						/>
					</View>
				}
			</View>
		);
	}
}

class TicketCategory extends React.Component{ //only for home screen (to display ticket sub categories)
	constructor(props){
		super(props);
		this.state = {
			category: props.category || '',
			ticketList: props.ticketList || [],
			theme: {
				colors: {
					text: 'white',
					primary: 'white',
					background: 'orange',
				},
			},
		}
	}
	componentDidMount(){
		
	}
	componentWillUnmount(){

	}
	render(){
		return (
			<View style={{
				flex: 1, 
				marginBottom: 5,
			}}>
				<List.Accordion
					title={`${this.state.category} (${this.state.ticketList ? this.state.ticketList.length: null})`}
					theme={this.state.theme}>
					{
						this.state.ticketList.map(ticket=>{
							return <Ticket {...ticket} displayTicketHistory={this.props.displayTicketHistory} displayTicketNotes={this.props.displayTicketNotes} isHomeScreen={true}/>;
						})
					}
				</List.Accordion>
			</View>
		);
	}
}

// Ticket List Display Screen

const TicketListDisplayScreen = ({route, navigation})=>{
	const {category, isHomeScreen} = route.params;
	return (
		<View style={styles.container}>
			<TicketList navigation={navigation} category={category} isHomeScreen={isHomeScreen}/>
			<StatusBar style="auto" />
		</View>
	);
} 

// Ticket History

class TicketHistory extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			canDisplayInfo: false,
			emails: [props.fromEmail, 'john.doe@gmail.com', props.fromEmail, 'john.doe@gmail.com'],
		}
		this.displayInfo = this.displayInfo.bind(this);
		this.reply = this.reply.bind(this);
	}
	componentDidMount(){
		this.navigation = this.props.navigation;
	}
	componentWillUnmount(){

	}
	displayInfo(){
		this.setState({canDisplayInfo: !this.state.canDisplayInfo});
	}
	reply(){
		this.navigation.navigate({
			name: 'TicketReply',
			params: {
				ticketData: JSON.stringify(this.props),
			},
		});
	}
	render(){
		// ticket = {
		// 	key: getRandomId(),
		// 	id: csvData[i][1],
		// 	fromEmail: csvData[i][4],
		// 	subject: csvData[i][2],
		// 	remarks: csvData[i][3],
		// 	category: category || TICKET_CATEGORIES[Math.floor(Math.random()*TICKET_CATEGORIES.length)],
		// 	status: csvData[i][11],
		// 	emailDate: csvData[i][5],
		// 	createDate: csvData[i][7],
		// 	assignedTo: csvData[i][9],
		// 	followup: csvData[i][10],
		// 	elapse: csvData[i][12],
		// 	priority: csvData[i][13],
		// 	flagColour: flagColourList[Math.floor(Math.random()*flagColourList.length)],
		// };
		return (
			<View style={{
				flex: 1, 
				flexDirection: 'column', 
				justifyContent: 'flex-start', 
				width: Dimensions.get('window').width,
				padding: 15,
				}}>
				
				<View style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}>
					<Text style={styles.ticketSubject}>{this.props.subject}</Text>
					<View style={{flexDirection: 'row', alignItems: 'center'}}>
						<TouchableOpacity onPress={this.displayInfo}>
							<Image style={{
								width: 25,
								height: 25,
								marginRight: 5,
							}} source={ICONS.MENU}/>
						</TouchableOpacity>
						<TouchableOpacity onPress={()=>this.navigation.navigate({
							name: 'TicketUpdate',
							params: {
								ticketData: JSON.stringify(this.props),
							},
						})}>
							<Image style={{
								width: 25,
								height: 25,
							}} source={ICONS.UPDATE}/>
						</TouchableOpacity>
					</View>
				</View>
				
				{
					this.state.canDisplayInfo ? <View style={{
						paddingTop: 15,
						paddingBottom: 15,
					}}>
						<Text>Remarks: {this.props.remarks || '-'}</Text>
						<Text>Status: {this.props.status || '-'}</Text>
						<Text>Followup: {this.props.followup || '-'}</Text>
						<Text>Email Date: {this.props.emailDate || '-'}</Text>
						<Text>Create Date: {this.props.createDate || '-'}</Text>
						<Text>Elapse: {this.props.elapse || '-'}</Text>
						<Text>Assigned To: {this.props.assignedTo || '-'}</Text>
					</View>

					: null
				}
				<ScrollView>
					{
						this.state.emails.map((email, i)=><CollapsibleTicket key={getRandomId()} email={email} collapsed={i!=this.state.emails.length-1}/>)
					}

					{
						[...Array(this.props.attachmentNumber+1).keys()].map(i=>
							<TouchableOpacity key={getRandomId()} style={{
								flex: 1,
								flexDirection: 'column',
								justifyContent: 'center',
								backgroundColor: '#e3e3e3',
								marginBottom: 10,
								borderRadius: 10,
								width: '80%',

								shadowColor: "#000",
								shadowOffset: {
									width: 0,
									height: 1,
								},
								shadowOpacity: 0.22,
								shadowRadius: 2.22,

								elevation: 3,
							}}>
								<Image 
									style={{
										width: '100%',
										alignSelf: 'center',
									}}
									source={require('./images/pdf_demo_preview.png')}/>
								<View style={{
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'space-between',
								}}>
									<View style={{
										flexDirection: 'row',
										alignItems: 'center',
										padding: 5,
									}}>
										<Image style={{
											width: 20,
											height: 20,
											marginLeft: 5,
											marginRight: 5,
										}} source={ICONS.PDF}/>
										<Text style={{
											fontSize: 14,
										}}>test_attachment.pdf</Text>
									</View>
									<TouchableOpacity style={{
										flexDirection: 'row',
										alignItems: 'center',
									}}>
										<Image style={{
											width: 25,
											height: 25,
											marginRight: 5,
										}} source={ICONS.DOWNLOAD}/>
									</TouchableOpacity>
								</View>
							</TouchableOpacity>
						)
					}

					<View style={{
						marginTop: 15,
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
					}}
					key={getRandomId()}>
						<TouchableOpacity style={styles.ticketButtons} onPress={this.reply}>
							<Image style={{
								width: 20,
								height: 20,
								marginRight: 15,
							}} source={require('./images/reply_icon.png')}/>
							<Text style={{color: '#0061a7', fontSize: 14}}>Reply</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</View>
		);
	}
}

class CollapsibleTicket extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			email: props.email,
			collapsed: props.collapsed,
			demoText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		}
		this.toggleContent = this.toggleContent.bind(this);
	}
	toggleContent(){
		this.setState({collapsed: !this.state.collapsed});
	}
	render(){
		return (
			<View>
				<TouchableOpacity 
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						marginBottom: 15,
					}}
					onPress={this.toggleContent}>
					<View style={{flexDirection: 'row', alignItems: 'center',}}>
						<Image style={{
							width: 40,
							height: 40,
							marginRight: 15,
						}} source={ICONS.DEFAULT_USER}/>
						<Text style={styles.ticketSender}>{this.state.email}</Text>
					</View>
					{
						this.state.collapsed ?
					
						<View style={{
							marginLeft: 5,
							marginTop: 10,
							paddingTop: 1,
							paddingBottom: 1,
							paddingLeft: 5,
							paddingRight: 5,
							borderRadius: 10,
							backgroundColor: '#e3e3e3',
							alignSelf: 'flex-start',
							alignItems: 'center',
						}}>
							<Image style={{
								width: 20,
								height: 20,
							}} source={ICONS.COLLAPSED}/>
						</View>

						: null
					}
				</TouchableOpacity>
				{
					this.state.collapsed ? null : 
					
					<View style={{marginBottom: 20}}>
						<Text style={styles.ticketContent}>{this.state.demoText}</Text>
					</View>
				}
				<View
					style={{
						borderBottomColor: '#e3e3e3',
						borderBottomWidth: 1,
						marginBottom: 20,
					}}
				/>
			</View>
		);
	}
}

const TicketHistoryScreen = ({route, navigation})=>{
	const {ticketData} = route.params;

	console.log(JSON.parse(ticketData).fromEmail);
	return (
		<View style={styles.container}>
			<TicketHistory {...JSON.parse(ticketData)} navigation={navigation}/>
			<StatusBar style="auto" />
		</View>
	);
}

// Ticket Notes

class TicketNotes extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			dates: ['28 Sep 2021 10:54', '6 Aug 2021 21:24', '5 Aug 2021 22:50'],
		}
	}
	render(){
		return (
			<ScrollView>
				{
					this.state.dates.map((date, i)=>
						<View key={getRandomId()} style={{flex: 1, width: Dimensions.get('window').width, padding: 10}}>
							<View style={{
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between',
								marginBottom: 15,
							}}>
								<View style={{
									flexDirection: 'row',
									alignItems: 'center',
								}}>
									<Image style={{
										width: 40,
										height: 40,
										marginRight: 15,
									}} source={ICONS.DEFAULT_USER}/>
									<Text>System</Text>
								</View>
								<Text style={{fontStyle: 'italic', fontWeight: 'bold'}}>{date}</Text>
							</View>
							<Text style={{color: '#808080', fontStyle: 'italic', marginBottom: 10,}}>#{this.props.id}</Text>
							<View style={{flexDirection: 'column', marginBottom: 15,}}>
								<Text>System has assigned Ticket [#CSS-{this.props.id}] To System</Text>
								<Text>demo test</Text>
							</View>
							<View
								style={{
									borderBottomColor: '#e3e3e3',
									borderBottomWidth: 1,
								}}
							/>
						</View>
					)
				}
			</ScrollView>
		);
	}
}

const TicketNotesScreen = ({route, navigation}) => {
	const {ticketData} = route.params;
	return (
		<View style={styles.container}>
			<TicketNotes {...JSON.parse(ticketData)}/>
			<StatusBar style='auto'/>
		</View>
	);
}

// Ticket Update

class TicketUpdate extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return (
			<View style={{flex: 1, width: Dimensions.get('window').width, paddingTop: 10, paddingBottom: 10,}}>
				<ScrollView style={{flex: 1, flexDirection: 'column'}}>
					<View style={styles.ticketUpdateSection} key={getRandomId()}>
						<Text style={styles.ticketUpdateTitle}>Ticket ID</Text>
						<Text style={{fontSize: 16,}}>{this.props.id}</Text>
					</View>
					<View style={styles.ticketUpdateSection} key={getRandomId()}>
						<Text style={styles.ticketUpdateTitle}>E-Mail Address</Text>
						<TextInput
							style={styles.ticketUpdateInput}
							value={this.props.fromEmail}
						/>
					</View>
					<View style={styles.ticketUpdateSection} key={getRandomId()}>
						<Text style={styles.ticketUpdateTitle}>Subject</Text>
						<TextInput
							style={styles.ticketUpdateInput}
							value={this.props.subject}
						/>
					</View>
					<View style={styles.ticketUpdateSection} key={getRandomId()}>
						<Text style={styles.ticketUpdateTitle}>Ticket Source</Text>
						<TextInput
							style={styles.ticketUpdateInput}
							value='Email'
						/>
					</View>
					<View style={styles.ticketUpdateSection} key={getRandomId()}>
						<Text style={styles.ticketUpdateTitle}>Assigned To:</Text>
						<TextInput
							style={styles.ticketUpdateInput}
							value={this.props.assignedTo}
						/>
					</View>
					<View style={styles.ticketUpdateSection} key={getRandomId()}>
						<Text style={styles.ticketUpdateTitle}>Followup Date</Text>
						<TextInput
							style={styles.ticketUpdateInput}
							value={this.props.followup.split('-').join(' ')}
						/>
					</View>
					<View style={styles.ticketUpdateSection} key={getRandomId()}>
						<Text style={styles.ticketUpdateTitle}>Company Name</Text>
						<TextInput
							style={styles.ticketUpdateInput}
							value='AGM SOLE SHAREHOLDER PTE. LTD.'
						/>
					</View>
					<View style={styles.ticketUpdateSection} key={getRandomId()}>
						<Text style={styles.ticketUpdateTitle}>Internal Notes</Text>
						<TextInput
							multiline
							numberOfLines={4}
							style={styles.ticketUpdateInput}
							value=''
						/>
					</View>
					<View style={styles.ticketUpdateSection} key={getRandomId()}>
						<Text style={styles.ticketUpdateTitle}>Ticket Status</Text>
						<TextInput
							style={styles.ticketUpdateInput}
							value={this.props.status}
						/>
					</View>
					<TouchableOpacity style={{
						paddingTop: 10,
						paddingBottom: 10,
						paddingLeft: 15,
						paddingRight: 15,
						backgroundColor: '#0061a7',
						borderRadius: 10,
						textAlign: 'center',
						marginLeft: 10,
						alignSelf: 'flex-start',
						justifyContent: 'center',
						alignItems: 'center',
					}}
					onPress={this.props.goBack}
					key={getRandomId()}>
						<Text style={{color: 'white', fontSize: 16,}}>Apply</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>
		);
	}
}

const TicketUpdateScreen = ({route, navigation}) => {
	const {ticketData} = route.params;
	return (
		<View style={styles.container}>
			<TicketUpdate {...JSON.parse(ticketData)} goBack={navigation.goBack}/>
			<StatusBar style="auto" />
		</View>
	);
}

// Ticket Reply

class TicketReply extends React.Component{
	constructor(props){
		super(props);
		this.state = {

		}
	}
	render(){
		return (
			<ScrollView style={{flex: 1, flexDirection: 'column', width: Dimensions.get('window').width, }}>
				<View style={styles.ticketReplySection} key={getRandomId()}>
					<Text style={styles.ticketReplyTitle}>Company Name</Text>
					<TextInput style={styles.ticketReplyInput} value='Agm Sole Shareholder Pte. Ltd'/>
				</View>
				<View style={styles.ticketReplySection} key={getRandomId()}>
					<Text style={styles.ticketReplyTitle}>To</Text>
					<TextInput style={styles.ticketReplyInput} value={this.props.fromEmail}/>
				</View>
				<View style={styles.ticketReplySection} key={getRandomId()}>
					<Text style={styles.ticketReplyTitle}>Cc</Text>
					<TextInput style={styles.ticketReplyInput} value=''/>
				</View>
				<View style={styles.ticketReplySection} key={getRandomId()}>
					<Text style={styles.ticketReplyTitle}>Bcc</Text>
					<TextInput style={styles.ticketReplyInput} value=''/>
				</View>
				<View style={styles.ticketReplySection} key={getRandomId()}>
					<Text style={styles.ticketReplyTitle}>Subject</Text>
					<TextInput style={styles.ticketReplyInput} value={this.props.subject}/>
				</View>
				<View style={styles.ticketReplySection} key={getRandomId()}>
					<Text style={styles.ticketReplyTitle}>Assign To</Text>
					<TextInput style={styles.ticketReplyInput} value=''/>
				</View>
				<View style={styles.ticketReplySection} key={getRandomId()}>
					<Text style={styles.ticketReplyTitle}>Followup Date</Text>
					<TextInput style={styles.ticketReplyInput} value='06/08/2021'/>
				</View>
				<View style={styles.ticketReplySection} key={getRandomId()}>
					<Text style={styles.ticketReplyTitle}>Premade Category</Text>
					<TextInput style={styles.ticketReplyInput} value='Choose Category'/>
				</View>
				<View style={styles.ticketReplySection} key={getRandomId()}>
					<Text style={styles.ticketReplyTitle}>Premade Response</Text>
					<TextInput style={styles.ticketReplyInput} value='Choose Premade Reply'/>
				</View>
				<View style={{...styles.ticketReplySection, flexDirection: 'column', alignSelf: 'flex-start', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 5,}} key={getRandomId()}>
					<Text style={{...styles.ticketReplyTitle, marginBottom: 5,}}>Attach Files</Text>
					<TouchableOpacity style={{...styles.ticketReplyButton, marginBottom: 5}}>
						<Text style={{color: 'white'}}>Browse Documents</Text>
					</TouchableOpacity>
					<TouchableOpacity style={{...styles.ticketReplyButton, marginBottom: 5}}>
						<Text style={{color: 'white'}}>Browse Repository</Text>
					</TouchableOpacity>
					<TouchableOpacity style={{...styles.ticketReplyButton, marginBottom: 5}}>
						<Text style={{color: 'white'}}>Browse CDD Documents</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.ticketReplySection} key={getRandomId()}>
					<TextInput
						style={styles.ticketReplyInput}
						multiline
						numberOfLines={16}
						value=''
					/>
				</View>
				<View style={styles.ticketReplySection} key={getRandomId()}>
					<TouchableOpacity style={styles.ticketReplyButton}>
						<Text style={{color: 'white'}}>Post Reply</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.ticketReplyButton}>
						<Text style={{color: 'white'}}>Post Reply with Followup</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		);
	}
}

const TicketReplyScreen = ({route, navigation})=>{
	const {ticketData} = route.params;
	
	return (
		<View style={styles.container}> 
			<TicketReply {...JSON.parse(ticketData)}/>
			<StatusBar style="auto" />
		</View>
	);
}

const Drawer = createDrawerNavigator();

export default function App() {

	const screenOptions = {
		headerStyle: {
			backgroundColor: 'rgb(0,97,167)',
		},
		headerTintColor: 'white',
	}

	return (
		<NavigationContainer>
			<Drawer.Navigator 
				screenOptions={{ headerShown: true }}
				drawerContent={props => <DrawerContent {...props}/>}>
				<Drawer.Screen 
					name='Home' 
					component={TicketListDisplayScreen}
					initialParams={{
						isHomeScreen: true,
						category: '',
					}}
					options={screenOptions}
				/>
				<Drawer.Screen 
					name='Subsidiary 1 Support' 
					component={TicketListDisplayScreen}
					initialParams={{
						isHomeScreen: false,
						category: 'Subsidiary 1 Support',
					}}
					options={screenOptions}
				/>
				<Drawer.Screen 
					name='Subsidiary 1 CDD' 
					component={TicketListDisplayScreen}
					initialParams={{
						isHomeScreen: false,
						category: 'Subsidiary 1 CDD',
					}}
					options={screenOptions}
				/>
				<Drawer.Screen 
					name='Subsidiary 1 Accounts' 
					component={TicketListDisplayScreen}
					initialParams={{
						isHomeScreen: false,
						category: 'Subsidiary 1 Accounts',
					}}
					options={screenOptions}
				/>
				<Drawer.Screen 
					name='Subsidiary 1 SOA' 
					component={TicketListDisplayScreen}
					initialParams={{
						isHomeScreen: false,
						category: 'Subsidiary 1 SOA',
					}}
					options={screenOptions}
				/>
				<Drawer.Screen 
					name='Subsidiary 1 Migration' 
					component={TicketListDisplayScreen}
					initialParams={{
						isHomeScreen: false,
						category: 'Subsidiary 1 Migration',
					}}
					options={screenOptions}
				/>
				<Drawer.Screen 
					name='Subsidiary 1 Tax' 
					component={TicketListDisplayScreen}
					initialParams={{
						isHomeScreen: false,
						category: 'Subsidiary 1 Tax',
					}}
					options={screenOptions}
				/>
				<Drawer.Screen
					name='TicketHistory' 
					component={TicketHistoryScreen}
					options={{
						...screenOptions,
						title: 'Ticket Thread',
					}}
				/>
				<Drawer.Screen 
					name='TicketNotes'
					component={TicketNotesScreen}
					options={{
						...screenOptions,
						title: 'Ticket Notes',
					}}
				/>
				<Drawer.Screen 
					name='TicketUpdate'
					component={TicketUpdateScreen}
					options={{
						...screenOptions,
						title: 'Update Ticket',
					}}
				/>
				<Drawer.Screen 
					name='TicketReply'
					component={TicketReplyScreen}
					options={{
						...screenOptions,
						title: 'Reply',
					}}
				/>
			</Drawer.Navigator>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		// marginTop: Constants.statusBarHeight,
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	ticket: {
		position: 'relative',
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 10,
		paddingBottom: 5,
		marginBottom: 10,
		backgroundColor: 'white',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.2,
		shadowRadius: 2.5,
		elevation: 4,
	},
	ticketList: {
		flex: 1,
		width: Dimensions.get('window').width,
		height: '90%',
	},
	ticketSubject: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	ticketSender: {
		fontSize: 16,
	},
	ticketContent: {
		fontSize: 16,
	},
	ticketButtons: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		borderRadius: 5,
		borderWidth: 2,
		borderColor: '#0061a7',
	},
	ticketUpdateSection: {
		flexDirection: 'column',
		marginBottom: 15, 
		paddingLeft: 10, 
		paddingRight: 10
	},
	ticketUpdateTitle: {
		fontWeight: 'bold', 
		fontSize: 16, 
		marginBottom: 5,
	},
	ticketUpdateInput: {
		padding: 5,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#e3e3e3',
		fontSize: 16,
	},
	ticketReplySection: {
		flexGrow: 1,
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 10,
		marginBottom: 5,
	},
	ticketReplyTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		marginRight: 15,
	},
	ticketReplyButton: {
		paddingTop: 5,
		paddingBottom: 5,
		paddingLeft: 10,
		paddingRight: 10,
		borderRadius: 10,
		backgroundColor: '#0061a7',
		marginRight: 10,
	},
	ticketReplyInput: {
		flexGrow: 1,
		fontSize: 16,
		padding: 5,
		borderRadius: 5, 
		borderWidth: 1, 
		borderColor: '#e3e3e3'
	},
});
