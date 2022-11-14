import { useEffect, useState } from "react";
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import uuid from 'react-native-uuid';
import Modal from "react-native-modal";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function() {
	const image = require('./src/assets/bg.jpg');
	const [tarefas, setTarefas] = useState([]);
	const [task, setTask] = useState('');

	const [isVisible, setIsVisible] = useState(false);



	const addTask = async () => {

		let newTask = tarefas;
		newTask.push({id: uuid.v4(), task: task})
		setTarefas(newTask);

		try {
			await AsyncStorage.setItem('@tasks:key', JSON.stringify(newTask));
		} catch (e) {
			// saving error
		}
		
		setTask('');
		setIsVisible(!isVisible);
	}

	const deletarTarefa = async (id) => {
		let novaTarefa = tarefas.filter(item => item.id != id);

		setTarefas(novaTarefa);

		try {
			await AsyncStorage.setItem('@tasks:key', JSON.stringify(novaTarefa));
		} catch (e) {
			// saving error
		}
	}

	const recuperarTask = async() => {
		try {	
			let newTarefa = await AsyncStorage.getItem('@tasks:key');
			setTarefas(JSON.parse(newTarefa));

			if (newTarefa == null) {
				setTarefas([]);
			}
			
		} catch(e) {
			// error reading value
		}
	}

	useEffect(()=>{recuperarTask()},[]);

	return(
		<View style={{flex:1}}>
			<View style={styles.header}>
				<ImageBackground
					source={image}
					style={styles.bg}
				>
					<View style={styles.bgFilter}>
						<Text>
							Lista de tarefas
						</Text>
					</View>
				</ImageBackground>
			</View>

			<ScrollView style={{flex:1}}>
				{ 
					tarefas.map(function (item, index){ 
						return(
							<View style={styles.tarefaSingle} key={index}>
								<View>
									<Text>{item.task}</Text>
								</View>
								<View>
									<TouchableOpacity 
										onPress={()=>deletarTarefa(item.id)}
										style={styles.btnDel}
									>
										<Icon name="minus" size={24} color="fff" />
									</TouchableOpacity>
								</View>
							</View>	
						)
					})
				}		
			</ScrollView>

			<TouchableOpacity style={styles.btnAddTask} onPress={()=>setIsVisible(!isVisible)}>
				<Icon name="plus" size={24} color="green" />
			</TouchableOpacity>

			<Modal
				isVisible={isVisible}
				>
				<View style={{ flex: 1}}>
					<View style={styles.modalBody}>
						<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
							<TextInput 
							    value={task}
								onChangeText={e=>setTask(e)}
								style={styles.input}
								placeholder="Digite a sua tarefa"
								placeholderTextColor="#000"
								autoFocus={true}
							/>
						</View>

						<View style={styles.bodyBtn}>
							<TouchableOpacity style={styles.btnModal} onPress={()=>setIsVisible(!isVisible)}>
								<Icon name="close" size={24} color="red" />
							</TouchableOpacity>

							<TouchableOpacity style={styles.btnModal} onPress={()=>addTask()}>
								<Icon name="check" size={24} color="green" />
							</TouchableOpacity>
						</View>
					</View>
				</View>
    		</Modal>

		</View>
	)
}

const styles = StyleSheet.create({
	header: {
		height: 80,
		backgroundColor: 'red'
	}, 
	tarefaSingle: {
		marginTop: 30,
		width: '100%',
		minHeight: 30,
		borderBottomWidth: 1,
		borderColor: '#ccc',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingBottom: 10,
		paddingLeft: 10,
		paddingRight: 10
	},	
	bg: {
		flex: 1
	},
	bgFilter: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)' 
	}, 
	btnDel: {
		width: 30,
		height: 30, 
		borderWidth: 1,
		borderColor: '#fff',
		borderRadius: 25,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	}, 
	btnAddTask:{
		width: 50,
		height: 50,
		borderRadius: 25, 
		backgroundColor: '#fff', 
		flexDirection: 'row', 
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute', 
		bottom: 20, 
		right: 20,
	}, 
	modalBody: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 10
	}, 
	bodyBtn: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 10
	},
	btnModal: {
		width: 50,
		height: 50,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 25,
		backgroundColor: '#ccc',
	},
	input: {
		borderWidth: 1,
		width: '100%',
		borderStyle: 'solid',
		borderColor: '#000',
		color: '#000'
	}
});