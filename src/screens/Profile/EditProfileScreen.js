import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, app } from '../../firebase/firebase';

import { useTheme } from '.././ThemeProvider';
import { MaterialIcons } from '@expo/vector-icons';

import GenderPicker from '../../components/GenderPicker';
import { useSettings } from '../../components/settings/SettingsContext';
import { DeleteAccountButton } from './DeleteAccount';

const db = getFirestore(app);
const storage = getStorage(app);

export default function ProfileEditScreen({ navigation }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const {units, setUnits} = useSettings();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weight, setWeight] = useState('');
  const [goals, setGoals] = useState('');
  const [gymExperience, setGymExperience] = useState('Beginner');
  const [benchPress, setBenchPress] = useState('');
  const [squat, setSquat] = useState('');
  const [deadlift, setDeadlift] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(null);

  const user = auth.currentUser;
  const styles = getStyles(isDark);

    
  useEffect(() => {
    async function fetchProfile() {
      if (!user) return Alert.alert('No user logged in');
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const d = snap.data();
          setName(d.name||''); setBio(d.bio||''); setGender(d.gender||'');
          setAge(d.age?String(d.age): '');
          setWeight(d.weight?String(d.weight): '');
          if (units==='metric') setHeightCm(d.height?String(d.height*2.54): '');
          else {
            const inches = d.height||0;
            setHeightFt(String(Math.floor(inches/12)));
            setHeightIn(String(inches%12));
          }
          setGoals(d.goals||''); setGymExperience(d.gymExperience||'Beginner');
          setBenchPress(String(d.prs?.benchPress||''));
          setSquat(String(d.prs?.squat||''));
          setDeadlift(String(d.prs?.deadlift||''));
          setProfilePicUrl(d.profilePicUrl||null);
        }
      } catch(e) { Alert.alert('Error', e.message); }
      setLoading(false);
    }
    fetchProfile();
  }, [user, units]);



  const lastUnits = useRef(units);

  useEffect(() => {
    if (loading) return;

    // Prevent unnecessary double conversion
    if (units === lastUnits.current) return;

    console.log("Converting units...");

    const convert = (val, fn) => {
      const n = parseFloat(val);
      if (isNaN(n)) return val;
      return Math.round(fn(n)).toString();
    };

    const kgToLbs = kg => kg * 2.20462;
    const lbsToKg = lbs => lbs / 2.20462;

    if (units === 'metric') {
      setBenchPress(prev => convert(prev, lbsToKg));
      setSquat(prev => convert(prev, lbsToKg));
      setDeadlift(prev => convert(prev, lbsToKg));
    } else {
      setBenchPress(prev => convert(prev, kgToLbs));
      setSquat(prev => convert(prev, kgToLbs));
      setDeadlift(prev => convert(prev, kgToLbs));
    }

    lastUnits.current = units;
  }, [units, loading]);

  const pickImage = async () => {
    const p = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!p.granted) return Alert.alert('Permission required');
    const r = await ImagePicker.launchImageLibraryAsync({ allowsEditing:true, aspect:[1,1], quality:0.7 });
    if (!r.canceled) { setImageUri(r.assets[0].uri); setProfilePicUrl(null); }
  };

  const uploadImage = async uri => {
    const res = await fetch(uri);
    const blob = await res.blob();
    const stRef = ref(storage, `profile_pics/${user.uid}.jpg`);
    await uploadBytes(stRef, blob);
    return getDownloadURL(stRef);
  };

  const toInches = () => {
    if (units==='metric') return Number(heightCm)/2.54;
    return (Number(heightFt)||0)*12 + (Number(heightIn)||0);
  };
  
  const kgToLbs = (kg) => kg * 2.20462;
  const lbsToKg = (lbs) => lbs / 2.20462;
  const toLbs = (number) => {
    if (units ==='metric') return Math.round(Number(kgToLbs(number)));
    return number;
  }

  

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert('Missing name');
    setSaving(true);
    let picUrl = profilePicUrl;
    if (imageUri) {
      const u = await uploadImage(imageUri);
      if (u) picUrl = u;
    }
    const h = Math.round(toInches());
    const body = { name:name.trim(), bio, gender, age:Number(age), height:h,
      goals, profilePicUrl:picUrl, gymExperience,
      prs:{ benchPress:Number(toLbs(benchPress))||0, squat:Number(toLbs(squat))||0, deadlift:Number(toLbs(deadlift))||0 },
      weight:Number(weight),
      updatedAt:serverTimestamp(), profileComplete:true };
    try { await setDoc(doc(db,'users',user.uid),body,{merge:true}); navigation.goBack(); }
    catch(e){Alert.alert('Error',e.message);} finally{setSaving(false);}
  };

  if (loading) return <View style={styles.container}><ActivityIndicator/></View>;

  return (
    <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS==='ios'?'padding':'height'}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Edit Profile</Text>
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {imageUri||profilePicUrl
            ? <Image source={{uri:imageUri||profilePicUrl}} style={styles.profileImage}/>
            : <View style={styles.placeholder}><MaterialIcons name="edit" size={40} color="#888"/></View> }
        </TouchableOpacity>

        <TextInput style={styles.input} placeholder="Name" placeholderTextColor={isDark?'#888':'#aaa'}
          value={name} onChangeText={setName}/>
        <TextInput style={[styles.input,{height:80}]} placeholder="Bio" placeholderTextColor={isDark?'#888':'#aaa'}
          value={bio} onChangeText={setBio} multiline/>
        <GenderPicker gender={gender} setGender={setGender} isDark={isDark}/>
        <TextInput style={styles.input} placeholder="Age" keyboardType="numeric"
          placeholderTextColor={isDark?'#888':'#aaa'} value={age} onChangeText={setAge}/>
        <TextInput style={styles.input} placeholder="Weight (optional)" keyboardType="numeric"
          placeholderTextColor={isDark?'#888':'#aaa'} value={weight} onChangeText={setWeight}/>

        {/* unit toggle */}
        <View style={styles.unitToggle}>
          {['imperial','metric'].map(u=> (
            <TouchableOpacity key={u} style={[styles.unitBtn,units===u&&styles.unitSel]}
              onPress={() => setUnits(u)}>
              <Text style={units===u?styles.unitSelText:styles.unitText}>
                {u==='imperial'?'Imperial':'Metric'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {units==='metric'
          ? <TextInput style={styles.input} placeholder="Height (cm)" keyboardType="numeric"
              placeholderTextColor={isDark?'#888':'#aaa'} value={heightCm} onChangeText={setHeightCm}/>
          : <View style={styles.row}> 
              <TextInput style={[styles.input,{flex:1,marginRight:5}]} placeholder="ft" keyboardType="numeric"
                placeholderTextColor={isDark?'#888':'#aaa'} value={heightFt} onChangeText={setHeightFt}/>
              <TextInput style={[styles.input,{flex:1,marginLeft:5}]} placeholder="in" keyboardType="numeric"
                placeholderTextColor={isDark?'#888':'#aaa'} value={heightIn} onChangeText={setHeightIn}/>
            </View>
        }

        <TextInput style={styles.input} placeholder="Goals" placeholderTextColor={isDark?'#888':'#aaa'}
          value={goals} onChangeText={setGoals} multiline/>

        <Text style={styles.label}>Gym Experience</Text>
        <View style={styles.experienceOptions}>
          {['Beginner','Intermediate','Advanced'].map(l=> (
            <TouchableOpacity key={l} style={[styles.expOption,gymExperience===l&&styles.expSel]}
              onPress={()=>setGymExperience(l)}>
              <Text style={gymExperience===l?styles.expSelText:styles.expText}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>PRs ({units==='metric'?'kg':'lbs'})</Text>
        {['Bench','Squat','Deadlift'].map((lift,i)=>{
          const val = [benchPress,squat,deadlift][i];
          const setter = [setBenchPress,setSquat,setDeadlift][i];
          return (
            <View key={lift} style={styles.row}>
              <TextInput style={[styles.input,{flex:1}]} placeholder={lift}
                placeholderTextColor={isDark?'#888':'#aaa'} keyboardType="numeric"
                value={val} onChangeText={setter}/>
              <Text style={styles.unitLbl}>{units==='metric'?'kg':'lbs'}</Text>
            </View>
          );
        })}

        <TouchableOpacity style={[styles.button,saving&&styles.btnDis]} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnText}>Save Profile</Text>}
        </TouchableOpacity>
        
        <DeleteAccountButton navigation={navigation} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = isDark => StyleSheet.create({
  wrapper:{flex:1,backgroundColor:isDark?'#000':'#fff'},
  container:{padding:20},
  title:{fontSize:28,fontWeight:'bold',color:isDark?'#fff':'#000',alignSelf:'center',marginBottom:20},
  imagePicker:{alignSelf:'center',marginBottom:15},
  profileImage:{width:120,height:120,borderRadius:60,borderWidth:2,borderColor:isDark?'#fff':'#000'},
  placeholder:{width:120,height:120,borderRadius:60,backgroundColor:isDark?'#222':'#ddd',justifyContent:'center',alignItems:'center',borderWidth:2,borderColor:isDark?'#555':'#aaa'},
  input:{backgroundColor:isDark?'#111':'#f2f2f2',color:isDark?'#fff':'#000',borderRadius:8,padding:10,marginBottom:15},
  label:{fontWeight:'600',color:isDark?'#ccc':'#555',marginBottom:8},
  experienceOptions:{flexDirection:'row',justifyContent:'space-between',marginBottom:15},
  expOption:{flex:1,padding:10,marginHorizontal:5,borderRadius:6,alignItems:'center',borderWidth:1,borderColor:'#888'},
  expSel:{backgroundColor:'#4caf50',borderColor:'#4caf50'},
  expText:{color:isDark?'#fff':'#000'}, expSelText:{color:isDark?'#fff':'#000',fontWeight:'bold',fontSize:12},
  unitToggle:{flexDirection:'row',justifyContent:'center',marginBottom:15},
  unitBtn:{flex:1,padding:10,marginHorizontal:5,borderRadius:6,alignItems:'center',borderWidth:1,borderColor:'#888'},
  unitSel:{backgroundColor:'#007aff',borderColor:'#007aff'},
  unitText:{color:'#333'},unitSelText:{color:'#fff',fontWeight:'bold'},
  row:{flexDirection:'row',alignItems:'center',marginBottom:15},
  unitLbl:{marginLeft:8,color:isDark?'#ccc':'#555'},
  button:{backgroundColor:'#007aff',padding:15,borderRadius:10,alignItems:'center',marginTop:10},
  btnDis:{opacity:0.7},btnText:{color:'#fff',fontWeight:'bold',fontSize:16},
  titleHeader:{textAlign:'center',fontSize:18,fontStyle:'italic',color:isDark?'#ccc':'#555',marginBottom:20},
  
});
