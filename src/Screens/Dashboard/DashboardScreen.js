import React, { Component } from 'react'
import { ActivityIndicator,  FlatList , StatusBar,  Text,  TouchableOpacity, View, ImageBackground, StyleSheet,  ToastAndroid, TextInput } from 'react-native'
import Colors from '../../Assets/Colors/Colors'
import { Header, Image, Icon } from '@rneui/themed'
import { getData } from '../../Api/Api'
import axios from 'axios'
import { Dropdown } from 'react-native-element-dropdown'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
import NetInfo from "@react-native-community/netinfo";



const criteria = [
    { label: 'Search by Chapter', value: 'Search by Chapter' },
    { label: 'Search by Country', value: 'Search by Country' },
]

const country = [];

export default class DashboardScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            isRefreshing : false,
            allCompanyData : [],
            openSubModal : '',
            isDataLoading : false,
            selectedCountry : '',
            selectedChp : '',
            openCountryModal : false,
            openChapterModal : false,
            countryData : [],
            chpData : [],
            chapterData: [],
            filterCompanyData : [],
            openModal : false,
            fullCompanyINfo : [],
            toggleCountryDropdown : false,
        }
    }

    componentDidMount = () => {
        this.checkConnectivity();
        // this.fetchCompany_Data_func();
    }

    fetchCompany_Data_func = async () => {
        this.setState({ isDataLoading: true })
        const url = getData();

        await axios.get(url).then((resp) => {
            console.log("resp from company data ==> ", resp.data);
            this.setState({ allCompanyData : JSON.stringify(resp.data) })
            const value = JSON.stringify(resp.data);
            AsyncStorage.setItem('company-data', value);
            this.getData_func()
        }).catch((err) => {
            console.log("err  => ", err);
        })
    }

    getData_func = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('company-data');
          return jsonValue != null ? this.setState({ allCompanyData : JSON.parse(jsonValue) }, () => {
            var dummyCountryData = [];
            var dummyChpData = [];
            for (let i = 0; i < this.state.allCompanyData.length; i++) {
                const element = this.state.allCompanyData[i].Country;
                const chp = this.state.allCompanyData[i].Chapters;
                dummyCountryData.push(element);
                dummyChpData.push(chp)
            }
            var uniqueCountry = dummyCountryData.filter((item, i, array) => array.indexOf(item) === i);
            var uniqueChp = dummyChpData.filter((item, i, array) => array.indexOf(item) === i);

            setTimeout(() => {
                // country.push(unique)
                this.setState({ countryData : uniqueCountry, chpData : uniqueChp, isDataLoading: false })
                console.log("state country ==> ", this.state.chapterData, this.state.countryData);
            }, 10);

          }) : null;
        } catch (e) {
          // error reading value
          console.log("err  ==> ", e);
          this.setState({ isDataLoading : false })
        }
    };

    serachCompanyList_func = async (text) => {
        this.setState({ isDataLoading : true })
        let filteredData = this.state.allCompanyData.filter(function (item) {
            return item.Company_Name.includes(text) || item.Country.includes(text) || item.Type.includes(text) || item.Chapters.includes(text) || item.Booth_NO.includes(text);
        });
        
        this.setState({ filterCompanyData: filteredData, isDataLoading: false });
        // console.log("fliterd data --> ", this.state.filterCompanyData );
    }
    
    serachListBY_Country_func = async (text) => {
        console.log("country text ==> ", text );
        this.setState({ selectedCountry : text })
        let filteredData = this.state.allCompanyData.filter(function (item) {
            return item.Country.includes(text);
        });
        
        this.setState({ filterCompanyData: filteredData, isDataLoading: false });
        // console.log("fliterd data --> ", this.state.filterCompanyData );
    }
    
    serachListBY_Chptaer_func = async (text) => {
        console.log("country text ==> ", text );
        this.setState({ selectedChp : text })
        let filteredData = this.state.allCompanyData.filter(function (item) {
            return item.Chapters.includes(text);
        });
        
        this.setState({ filterCompanyData: filteredData, isDataLoading: false });
        // console.log("fliterd data --> ", this.state.filterCompanyData );
    }

    openInfoModal = (data) => {
        setTimeout(() => {
            this.setState({ openModal: true, fullCompanyINfo: data })
            console.log("===> ", this.state.fullCompanyINfo);
        }, 1000);
    }

    checkDropValue = (item) => {
       console.log("item --> ", item.value);
       this.setState({ openSubModal : item.value })
       if (item.value == 'Search by Country') {
        this.setState({ selectedCountry  : '' })
        this.serachCompanyList_func('')
       } else if (item.value == 'Search by Chapter') {
        this.setState({ selectedChp : '' })
        this.serachCompanyList_func('')
       } 
    }

    checkConnectivity = () => {
        NetInfo.addEventListener(state => {
            console.log("Is connected?", state.isConnected);
            if (state.isConnected) {
                console.log("start to fetch");
                this.fetchCompany_Data_func();
                
                // ToastAndroid.show("Syncing Data from Server", ToastAndroid.SHORT)
            } else {
                // ToastAndroid.show("Check Your Connnectivity", ToastAndroid.SHORT)
                this.getData_func()
            }
        });
    }


    render() {
        
        return (
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
                <StatusBar translucent={true} barStyle="dark-content" backgroundColor="transparent" />
                <Header backgroundColor={Colors.primaryColor} containerStyle={{ alignItems: 'center',  }} 
                    leftComponent={<Icon  name="chevron-back-outline" type='ionicon' size={20} color={Colors.whiteColor}/>}
                    rightComponent={<Icon  name="menu-outline" type='ionicon' size={20} color={Colors.whiteColor}/>}
                />
                <View style={{ flex: 1 }}>
                    <ImageBackground source={require('../../Assets/Images/bg.jpg')} style={{ height: '100%', width: '100%' }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ paddingHorizontal: 15, paddingTop: 20, flex: 0.9,  }}>        
                                <View style={{ paddingTop: 10, backgroundColor:  Colors.whiteColor,   }}>
                                    <View style={{ paddingHorizontal: 10,  }}>
                                        <Text style={{ color: Colors.primaryColor, fontSize: 18, fontWeight: '600', textTransform: 'uppercase' }}>Exhibitor List</Text>
                                        <View style={{ flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', paddingTop: 10 }}>
                                            <View style={{ width: '45%', }}>
                                                <Text style={styles.topMenuStyles}>Search by Keyword</Text>
                                                <TextInput placeholder='Search..' onChangeText={(text) => this.serachCompanyList_func(text.toUpperCase().trim()) } style={{ height: 35, borderBottomWidth:1, color: Colors.black_Color, }}  />
                                            </View>
                                            <View style={{ width: '45%', }}>
                                                <Text style={styles.topMenuStyles}>Search by Criteria</Text>
                                                <Dropdown
                                                    style={[styles.countryDropdown,]}
                                                    placeholderStyle={styles.placeholderStyle}
                                                    selectedTextStyle={styles.selectedTextStyle}
                                                    inputSearchStyle={styles.inputSearchStyle}
                                                    iconStyle={styles.iconStyle}
                                                    containerStyle={styles.countryConainerStyle}
                                                    itemTextStyle={styles.itemTextStyle}
                                                    data={criteria}
                                                    search={false}
                                                    maxHeight={280}
                                                    labelField="label"
                                                    valueField="value"
                                                    placeholder={'Select Criteria'}
                                                    dropdownPosition="bottom"
                                                    onChange={item => {
                                                        this.checkDropValue(item)
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    {
                                        this.state.openSubModal == 'Search by Country' ? 
                                        <View style={{ width: '50%', paddingTop: 20 }}>
                                                <Text style={styles.topMenuStyles}>{this.state.openSubModal}</Text>
                                                <Dropdown
                                                    style={[styles.countryDropdown,]}
                                                    placeholderStyle={styles.placeholderStyle}
                                                    selectedTextStyle={styles.selectedTextStyle}
                                                    inputSearchStyle={styles.inputSearchStyle}
                                                    iconStyle={styles.iconStyle}
                                                    containerStyle={styles.countryConainerStyle}
                                                    itemTextStyle={styles.itemTextStyle}
                                                    data={this.state.countryData.map(item => {
                                                        return ({
                                                            label: item,
                                                            value: item
                                                        })
                                                    })}
                                                    search={true}
                                                    maxHeight={280}
                                                    labelField='label'
                                                    valueField='value'
                                                    placeholder={ this.state.selectedCountry == '' ? this.state.openSubModal : this.state.selectedCountry}
                                                    dropdownPosition="bottom"
                                                    searchField='label'
                                                    searchPlaceholder={'Search Country'}
                                                    showsVerticalScrollIndicator={true}
                                                    onChange={item => {
                                                        this.serachListBY_Country_func(item.label)
                                                    }}
                                                   
                                                />
                                        </View> : this.state.openSubModal == 'Search by Chapter' ?  <View style={{ width: '50%', paddingTop: 20 }}>
                                                <Text style={styles.topMenuStyles}>{this.state.openSubModal}</Text>
                                                <Dropdown
                                                    style={[styles.countryDropdown,]}
                                                    placeholderStyle={styles.placeholderStyle}
                                                    selectedTextStyle={styles.selectedTextStyle}
                                                    inputSearchStyle={styles.inputSearchStyle}
                                                    iconStyle={styles.iconStyle}
                                                    containerStyle={styles.countryConainerStyle}
                                                    itemTextStyle={styles.itemTextStyle}
                                                    data={this.state.chpData.map(item => {
                                                        return ({
                                                            label: item,
                                                            value: item
                                                        })
                                                    })}
                                                    search={true}
                                                    maxHeight={280}
                                                    labelField="label"
                                                    valueField="value"
                                                    selectedTextProps={{ numberOfLines: 1 }}
                                                    placeholder={ this.state.selectedChp == '' ? this.state.openSubModal : this.state.selectedChp}
                                                    dropdownPosition="bottom"
                                                    searchField='label'
                                                    searchPlaceholder='Select Chapter'
                                                    showsVerticalScrollIndicator={true}
                                                    onChange={item => {
                                                        this.serachListBY_Chptaer_func(item.label)
                                                    }}
                                                   
                                                />
                                        </View> :  null
                                    }
                                    </View>

                                    <View  style={{ height: this.state.openSubModal == 'Search by Country' || this.state.openSubModal == 'Search by Chapter' ? '64%' : '77%' }}>
                                        <Text style={{ color: '#ba0014', fontWeight: '600', fontSize: 14, paddingVertical: 10, paddingLeft: 10 }}>Click on company name to view details.</Text>
                                        <View style={{ paddingVertical: 10, backgroundColor: '#23358c' }}>
                                            <Text style={{ color: Colors.whiteColor, fontSize: 18, fontWeight: '700', textAlignVertical: 'center', textTransform: 'capitalize', paddingLeft: 10 }}>company name</Text>
                                        </View>
                                        <View>
                                            <FlatList data={this.state.filterCompanyData && this.state.filterCompanyData.length > 0 ? this.state.filterCompanyData : this.state.allCompanyData} key={({ item, index }) => item.Booth_NO} renderItem={({ item,index }) => (
                                                    <TouchableOpacity onPress={() => this.openInfoModal(item) } style={[index%2 ===0 ? { backgroundColor: '#E9E9E9' } : { backgroundColor : Colors.whiteColor }, { padding: 8, flexDirection: 'row', alignItems: 'flex-start' }]}>
                                                        <Text style={{ color: '#636363', fontSize: 15, textTransform: 'uppercase', fontWeight: '500',  }}>{index+1}.</Text>
                                                        <Text style={{ color: '#636363', fontSize: 15, textTransform: 'uppercase', fontWeight: '500', paddingLeft: 5, width:'90%' }}>{item.Company_Name}</Text>
                                                    </TouchableOpacity>
                                            )} />
                                        </View>
                                    </View>

                                </View>
                            </View>

                            <View style={{ padding: 15,flex: 0.1, }}>
                                <View style={{ flexDirection: 'row', alignItems:'center', justifyContent: 'space-between', borderRadius: 10, padding: 10 ,backgroundColor: '#A6A6A6' }}>
                                    <View style={styles.bootomNavContainer}>
                                        <Icon name="notifications" type='ionicon' size={25} color={Colors.whiteColor} />
                                        <Text style={{ color: Colors.whiteColor, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', textAlign: 'center' }}>Alerts</Text>
                                    </View>
                                    <View style={{ backgroundColor: '#D1D1D1' ,  borderRadius: 100, top: '-10%' }}>
                                        <Image source={require('../../Assets/Images/bottom.jpg')} style={{ height: 50, width: 50, resizeMode: 'center', borderRadius: 100 }} />
                                    </View>
                                    <View style={styles.bootomNavContainer}>
                                        <Icon name="receipt" type='ionicon' size={25} color={Colors.whiteColor} />
                                        <Text style={{ color: Colors.whiteColor, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', textAlign: 'center' }}>floor plan</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                </View>

                <Modal isVisible={this.state.openModal} >
                    <View style={{ flex: 0.2, backgroundColor: Colors.whiteColor, borderRadius: 20 }}>
                        <View style={{  }}>
                            <View style={{ backgroundColor: '#3E7783', paddingVertical: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ textAlign:  'center', color: Colors.whiteColor, fontSize: 18, fontWeight: '600', width: '80%',  }}>{this.state.fullCompanyINfo.Company_Name}</Text>
                                <Icon onPress={() =>  this.setState({ openModal : false })} style={{ paddingLeft: 20 }} name='close' type='ionicon' size={25} color={Colors.whiteColor} />
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: '#00B2D6', paddingVertical: 20 }}>

                                <View>
                                    <Text style={styles.modalTextHeding}>type</Text>
                                    <Text style={[styles.modalTextHeding, { paddingVertical: 3 }]}>country</Text>
                                    <Text style={styles.modalTextHeding}>primary Chapter</Text>
                                    <Text style={[styles.modalTextHeding, { paddingVertical: 3 }]}>stall no.</Text>
                                </View>
                                <View>
                                    <Text style={styles.modalTextHeding2}>: {this.state.fullCompanyINfo.Type}</Text>
                                    <Text style={[styles.modalTextHeding2, { paddingVertical: 3 }]}>: {this.state.fullCompanyINfo.Country}</Text>
                                    <Text style={styles.modalTextHeding2}>: {this.state.fullCompanyINfo.Chapters}</Text>
                                    <Text style={[styles.modalTextHeding2, { paddingVertical: 3 }]}>: {this.state.fullCompanyINfo.Booth_NO}.</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>

            </View>
        )
    }
}


const styles = StyleSheet.create({

    topMenuStyles : {
        color: Colors.black_Color, 
        fontSize: 14, 
        fontWeight: '500',
    },

    dropdown: {
        height: 100,
        borderColor: Colors.whiteColor,
        // borderWidth: 0.5,
        // borderRadius: 8,
        paddingHorizontal: 0,
        width: '100%',
    },
    placeholderStyle: {
        fontSize: 13,
        color: Colors.light_grey
    },
    selectedTextStyle: {
        fontSize: 13,
        color: Colors.black_Color
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 13,
        color:  Colors.black_Color
    },
    countryConainerStyle : {
        backgroundColor:  Colors.whiteColor ,
        width: '100%',
    },
    itemTextStyle: {
        fontSize: 12,
        color: Colors.black_Color,
    },
   
    countryDropdown: {
        height: 30,
        width: '100%',
        
    },
    bootomNavContainer: {
        width: '40%'
    },
    modalTextHeding: {
        color: Colors.whiteColor, 
        fontSize:14, 
        fontWeight: '600',
        textTransform: 'capitalize'
    },
    modalTextHeding2: {
        color: Colors.whiteColor, 
        fontSize:14, 
        fontWeight: '400',
        textTransform: 'capitalize'
    }
});