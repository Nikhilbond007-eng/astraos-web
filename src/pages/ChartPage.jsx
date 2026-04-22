import { useState, useEffect } from 'react'
import { useStore } from '../utils/store'
import { SIGN_SYMBOLS, MOON_PHASES, DASHA_DESC } from '../utils/astrology'
import ChartWheel from '../components/ChartWheel'
import AstroChat from '../components/AstroChat'
import AuthModal from '../components/AuthModal'
import styles from './ChartPage.module.css'
import { generateChart } from '../utils/api'
import { saveChart, loadUserChart } from '../utils/supabase'
import { downloadChartPDF } from '../utils/generatePDF'

const PLANET_DESCS = [
  'Your core identity, vitality, and soul purpose',
  'Your mind, emotions, and intuitive nature',
  'Your intelligence, communication style',
  'Love, relationships, beauty, and pleasure',
  'Drive, courage, energy, and assertion',
  'Wisdom, expansion, luck, and dharma',
  'Karma, discipline, lessons, and longevity',
  'Desire, illusion, foreign connections, and ambition',
  'Spirituality, liberation, past lives, and moksha',
]

const CITIES = [
  // Maharashtra
  { name: 'Mumbai', lat: 19.076, lon: 72.877 },
  { name: 'Pune', lat: 18.520, lon: 73.856 },
  { name: 'Nagpur', lat: 21.145, lon: 79.089 },
  { name: 'Nashik', lat: 19.998, lon: 73.789 },
  { name: 'Aurangabad', lat: 19.877, lon: 75.343 },
  { name: 'Solapur', lat: 17.686, lon: 75.906 },
  { name: 'Kolhapur', lat: 16.705, lon: 74.243 },
  { name: 'Amravati', lat: 20.932, lon: 77.750 },
  { name: 'Nanded', lat: 19.160, lon: 77.321 },
  { name: 'Sangli', lat: 16.854, lon: 74.564 },
  { name: 'Malegaon', lat: 20.560, lon: 74.525 },
  { name: 'Jalgaon', lat: 21.004, lon: 75.562 },
  { name: 'Akola', lat: 20.706, lon: 77.007 },
  { name: 'Latur', lat: 18.400, lon: 76.560 },
  { name: 'Dhule', lat: 20.901, lon: 74.777 },
  { name: 'Ahmednagar', lat: 19.095, lon: 74.738 },
  { name: 'Chandrapur', lat: 19.961, lon: 79.296 },
  { name: 'Parbhani', lat: 19.270, lon: 76.780 },
  { name: 'Thane', lat: 19.218, lon: 72.978 },
  { name: 'Navi Mumbai', lat: 19.033, lon: 73.029 },
  // Delhi & NCR
  { name: 'Delhi', lat: 28.614, lon: 77.209 },
  { name: 'New Delhi', lat: 28.635, lon: 77.224 },
  { name: 'Noida', lat: 28.535, lon: 77.391 },
  { name: 'Gurgaon', lat: 28.459, lon: 77.026 },
  { name: 'Faridabad', lat: 28.408, lon: 77.317 },
  { name: 'Ghaziabad', lat: 28.670, lon: 77.416 },
  // Uttar Pradesh
  { name: 'Lucknow', lat: 26.847, lon: 80.947 },
  { name: 'Kanpur', lat: 26.449, lon: 80.331 },
  { name: 'Agra', lat: 27.176, lon: 78.008 },
  { name: 'Varanasi', lat: 25.317, lon: 82.973 },
  { name: 'Prayagraj', lat: 25.435, lon: 81.846 },
  { name: 'Meerut', lat: 28.984, lon: 77.706 },
  { name: 'Bareilly', lat: 28.347, lon: 79.420 },
  { name: 'Aligarh', lat: 27.882, lon: 78.078 },
  { name: 'Moradabad', lat: 28.839, lon: 78.773 },
  { name: 'Saharanpur', lat: 29.968, lon: 77.546 },
  { name: 'Gorakhpur', lat: 26.760, lon: 83.373 },
  { name: 'Firozabad', lat: 27.152, lon: 78.395 },
  { name: 'Jhansi', lat: 25.448, lon: 78.568 },
  { name: 'Muzaffarnagar', lat: 29.473, lon: 77.703 },
  { name: 'Mathura', lat: 27.492, lon: 77.673 },
  { name: 'Ayodhya', lat: 26.795, lon: 82.194 },
  { name: 'Etawah', lat: 26.785, lon: 79.019 },
  { name: 'Mirzapur', lat: 25.145, lon: 82.569 },
  { name: 'Bulandshahr', lat: 28.407, lon: 77.849 },
  { name: 'Shahjahanpur', lat: 27.881, lon: 79.905 },
  { name: 'Farrukhabad', lat: 27.391, lon: 79.581 },
  { name: 'Hardoi', lat: 27.394, lon: 80.130 },
  // Rajasthan
  { name: 'Jaipur', lat: 26.912, lon: 75.787 },
  { name: 'Jodhpur', lat: 26.295, lon: 73.017 },
  { name: 'Kota', lat: 25.182, lon: 75.839 },
  { name: 'Bikaner', lat: 28.022, lon: 73.312 },
  { name: 'Ajmer', lat: 26.455, lon: 74.641 },
  { name: 'Udaipur', lat: 24.585, lon: 73.712 },
  { name: 'Bhilwara', lat: 25.347, lon: 74.636 },
  { name: 'Alwar', lat: 27.553, lon: 76.634 },
  { name: 'Bharatpur', lat: 27.215, lon: 77.503 },
  { name: 'Sri Ganganagar', lat: 29.912, lon: 73.877 },
  { name: 'Sikar', lat: 27.612, lon: 75.139 },
  { name: 'Pali', lat: 25.771, lon: 73.323 },
  { name: 'Barmer', lat: 25.753, lon: 71.394 },
  { name: 'Jhunjhunu', lat: 28.132, lon: 75.400 },
  { name: 'Chittorgarh', lat: 24.888, lon: 74.624 },
  { name: 'Tonk', lat: 26.166, lon: 75.789 },
  // Gujarat
  { name: 'Ahmedabad', lat: 23.023, lon: 72.572 },
  { name: 'Surat', lat: 21.170, lon: 72.831 },
  { name: 'Vadodara', lat: 22.307, lon: 73.181 },
  { name: 'Rajkot', lat: 22.303, lon: 70.802 },
  { name: 'Bhavnagar', lat: 21.763, lon: 72.152 },
  { name: 'Jamnagar', lat: 22.468, lon: 70.058 },
  { name: 'Junagadh', lat: 21.522, lon: 70.457 },
  { name: 'Gandhinagar', lat: 23.216, lon: 72.684 },
  { name: 'Anand', lat: 22.557, lon: 72.951 },
  { name: 'Navsari', lat: 20.950, lon: 72.952 },
  { name: 'Morbi', lat: 22.817, lon: 70.837 },
  { name: 'Mehsana', lat: 23.600, lon: 72.369 },
  { name: 'Bharuch', lat: 21.705, lon: 72.998 },
  { name: 'Porbandar', lat: 21.644, lon: 69.609 },
  // Madhya Pradesh
  { name: 'Indore', lat: 22.719, lon: 75.858 },
  { name: 'Bhopal', lat: 23.259, lon: 77.413 },
  { name: 'Jabalpur', lat: 23.182, lon: 79.987 },
  { name: 'Gwalior', lat: 26.218, lon: 78.183 },
  { name: 'Ujjain', lat: 23.182, lon: 75.784 },
  { name: 'Sagar', lat: 23.839, lon: 78.738 },
  { name: 'Dewas', lat: 22.963, lon: 76.051 },
  { name: 'Satna', lat: 24.602, lon: 80.832 },
  { name: 'Ratlam', lat: 23.334, lon: 75.038 },
  { name: 'Rewa', lat: 24.532, lon: 81.296 },
  { name: 'Singrauli', lat: 24.199, lon: 82.674 },
  { name: 'Burhanpur', lat: 21.308, lon: 76.231 },
  { name: 'Khandwa', lat: 21.833, lon: 76.350 },
  { name: 'Chhindwara', lat: 22.057, lon: 78.939 },
  { name: 'Mandsaur', lat: 24.074, lon: 75.069 },
  // Karnataka
  { name: 'Bengaluru', lat: 12.972, lon: 77.593 },
  { name: 'Mysuru', lat: 12.296, lon: 76.639 },
  { name: 'Hubli', lat: 15.363, lon: 75.124 },
  { name: 'Mangaluru', lat: 12.914, lon: 74.856 },
  { name: 'Belagavi', lat: 15.849, lon: 74.497 },
  { name: 'Davanagere', lat: 14.465, lon: 75.922 },
  { name: 'Ballari', lat: 15.148, lon: 76.920 },
  { name: 'Vijayapura', lat: 16.828, lon: 75.715 },
  { name: 'Shivamogga', lat: 13.932, lon: 75.568 },
  { name: 'Tumakuru', lat: 13.341, lon: 77.101 },
  { name: 'Raichur', lat: 16.212, lon: 77.356 },
  { name: 'Bidar', lat: 17.914, lon: 77.527 },
  { name: 'Hassan', lat: 13.008, lon: 76.100 },
  { name: 'Udupi', lat: 13.342, lon: 74.742 },
  // Tamil Nadu
  { name: 'Chennai', lat: 13.083, lon: 80.270 },
  { name: 'Coimbatore', lat: 11.017, lon: 76.955 },
  { name: 'Madurai', lat: 9.925, lon: 78.120 },
  { name: 'Tiruchirappalli', lat: 10.805, lon: 78.687 },
  { name: 'Salem', lat: 11.665, lon: 78.146 },
  { name: 'Tirunelveli', lat: 8.727, lon: 77.701 },
  { name: 'Tiruppur', lat: 11.108, lon: 77.341 },
  { name: 'Erode', lat: 11.341, lon: 77.717 },
  { name: 'Vellore', lat: 12.916, lon: 79.132 },
  { name: 'Thoothukudi', lat: 8.764, lon: 78.130 },
  { name: 'Dindigul', lat: 10.362, lon: 77.971 },
  { name: 'Thanjavur', lat: 10.787, lon: 79.140 },
  { name: 'Kancheepuram', lat: 12.834, lon: 79.704 },
  { name: 'Nagercoil', lat: 8.178, lon: 77.434 },
  { name: 'Cuddalore', lat: 11.748, lon: 79.768 },
  // Andhra Pradesh
  { name: 'Visakhapatnam', lat: 17.686, lon: 83.218 },
  { name: 'Vijayawada', lat: 16.506, lon: 80.648 },
  { name: 'Guntur', lat: 16.307, lon: 80.436 },
  { name: 'Nellore', lat: 14.443, lon: 79.987 },
  { name: 'Kurnool', lat: 15.828, lon: 78.037 },
  { name: 'Rajahmundry', lat: 17.005, lon: 81.784 },
  { name: 'Kakinada', lat: 16.980, lon: 82.247 },
  { name: 'Tirupati', lat: 13.629, lon: 79.419 },
  { name: 'Kadapa', lat: 14.467, lon: 78.823 },
  { name: 'Anantapur', lat: 14.682, lon: 77.601 },
  { name: 'Vizianagaram', lat: 18.117, lon: 83.411 },
  { name: 'Eluru', lat: 16.713, lon: 81.095 },
  { name: 'Ongole', lat: 15.504, lon: 80.045 },
  // Telangana
  { name: 'Hyderabad', lat: 17.385, lon: 78.487 },
  { name: 'Warangal', lat: 17.966, lon: 79.592 },
  { name: 'Nizamabad', lat: 18.672, lon: 78.094 },
  { name: 'Khammam', lat: 17.247, lon: 80.150 },
  { name: 'Karimnagar', lat: 18.438, lon: 79.132 },
  { name: 'Ramagundam', lat: 18.757, lon: 79.474 },
  { name: 'Mahbubnagar', lat: 16.738, lon: 77.988 },
  { name: 'Nalgonda', lat: 17.050, lon: 79.267 },
  { name: 'Adilabad', lat: 19.664, lon: 78.532 },
  // Kerala
  { name: 'Kochi', lat: 9.939, lon: 76.270 },
  { name: 'Thiruvananthapuram', lat: 8.524, lon: 76.936 },
  { name: 'Kozhikode', lat: 11.259, lon: 75.780 },
  { name: 'Thrissur', lat: 10.527, lon: 76.214 },
  { name: 'Kollam', lat: 8.888, lon: 76.614 },
  { name: 'Kannur', lat: 11.869, lon: 75.371 },
  { name: 'Alappuzha', lat: 9.498, lon: 76.339 },
  { name: 'Palakkad', lat: 10.776, lon: 76.654 },
  { name: 'Malappuram', lat: 11.074, lon: 76.074 },
  { name: 'Kottayam', lat: 9.591, lon: 76.522 },
  // West Bengal
  { name: 'Kolkata', lat: 22.573, lon: 88.364 },
  { name: 'Asansol', lat: 23.683, lon: 86.983 },
  { name: 'Siliguri', lat: 26.717, lon: 88.428 },
  { name: 'Durgapur', lat: 23.480, lon: 87.320 },
  { name: 'Bardhaman', lat: 23.233, lon: 87.861 },
  { name: 'Malda', lat: 25.011, lon: 88.141 },
  { name: 'Kharagpur', lat: 22.346, lon: 87.323 },
  { name: 'Darjeeling', lat: 27.036, lon: 88.263 },
  { name: 'Jalpaiguri', lat: 26.544, lon: 88.718 },
  // Bihar
  { name: 'Patna', lat: 25.594, lon: 85.138 },
  { name: 'Gaya', lat: 24.797, lon: 85.012 },
  { name: 'Bhagalpur', lat: 25.244, lon: 86.972 },
  { name: 'Muzaffarpur', lat: 26.122, lon: 85.390 },
  { name: 'Purnia', lat: 25.778, lon: 87.477 },
  { name: 'Darbhanga', lat: 26.152, lon: 85.900 },
  { name: 'Arrah', lat: 25.556, lon: 84.657 },
  { name: 'Begusarai', lat: 25.418, lon: 86.128 },
  { name: 'Katihar', lat: 25.540, lon: 87.580 },
  { name: 'Munger', lat: 25.374, lon: 86.473 },
  { name: 'Chhapra', lat: 25.781, lon: 84.749 },
  { name: 'Sasaram', lat: 24.947, lon: 84.032 },
  { name: 'Hajipur', lat: 25.684, lon: 85.209 },
  // Jharkhand
  { name: 'Ranchi', lat: 23.344, lon: 85.309 },
  { name: 'Jamshedpur', lat: 22.805, lon: 86.203 },
  { name: 'Dhanbad', lat: 23.795, lon: 86.430 },
  { name: 'Bokaro', lat: 23.667, lon: 86.151 },
  { name: 'Deoghar', lat: 24.486, lon: 86.695 },
  { name: 'Hazaribagh', lat: 23.992, lon: 85.361 },
  { name: 'Giridih', lat: 24.191, lon: 86.308 },
  // Odisha
  { name: 'Bhubaneswar', lat: 20.296, lon: 85.825 },
  { name: 'Cuttack', lat: 20.462, lon: 85.883 },
  { name: 'Rourkela', lat: 22.260, lon: 84.853 },
  { name: 'Brahmapur', lat: 19.315, lon: 84.791 },
  { name: 'Sambalpur', lat: 21.467, lon: 83.975 },
  { name: 'Puri', lat: 19.812, lon: 85.831 },
  { name: 'Balasore', lat: 21.494, lon: 86.933 },
  // Chhattisgarh
  { name: 'Raipur', lat: 21.251, lon: 81.630 },
  { name: 'Bhilai', lat: 21.209, lon: 81.428 },
  { name: 'Durg', lat: 21.190, lon: 81.283 },
  { name: 'Bilaspur', lat: 22.090, lon: 82.148 },
  { name: 'Korba', lat: 22.346, lon: 82.688 },
  { name: 'Rajnandgaon', lat: 21.097, lon: 81.030 },
  { name: 'Raigarh', lat: 21.896, lon: 83.395 },
  { name: 'Jagdalpur', lat: 19.074, lon: 82.012 },
  { name: 'Ambikapur', lat: 23.119, lon: 83.197 },
  // Punjab
  { name: 'Ludhiana', lat: 30.901, lon: 75.857 },
  { name: 'Amritsar', lat: 31.634, lon: 74.873 },
  { name: 'Jalandhar', lat: 31.326, lon: 75.576 },
  { name: 'Patiala', lat: 30.340, lon: 76.386 },
  { name: 'Bathinda', lat: 30.211, lon: 74.944 },
  { name: 'Mohali', lat: 30.705, lon: 76.717 },
  { name: 'Pathankot', lat: 32.274, lon: 75.652 },
  { name: 'Moga', lat: 30.817, lon: 75.173 },
  { name: 'Firozpur', lat: 30.926, lon: 74.614 },
  { name: 'Sangrur', lat: 30.245, lon: 75.844 },
  // Haryana
  { name: 'Panipat', lat: 29.391, lon: 76.970 },
  { name: 'Ambala', lat: 30.378, lon: 76.776 },
  { name: 'Yamunanagar', lat: 30.129, lon: 77.266 },
  { name: 'Rohtak', lat: 28.895, lon: 76.606 },
  { name: 'Hisar', lat: 29.151, lon: 75.721 },
  { name: 'Karnal', lat: 29.685, lon: 76.990 },
  { name: 'Sonipat', lat: 28.994, lon: 77.021 },
  { name: 'Panchkula', lat: 30.695, lon: 76.853 },
  { name: 'Bhiwani', lat: 28.793, lon: 76.139 },
  { name: 'Sirsa', lat: 29.534, lon: 75.026 },
  // Himachal Pradesh
  { name: 'Shimla', lat: 31.104, lon: 77.167 },
  { name: 'Dharamsala', lat: 32.220, lon: 76.320 },
  { name: 'Solan', lat: 30.908, lon: 77.096 },
  { name: 'Mandi', lat: 31.708, lon: 76.932 },
  { name: 'Manali', lat: 32.239, lon: 77.189 },
  { name: 'Kullu', lat: 31.958, lon: 77.109 },
  // Uttarakhand
  { name: 'Dehradun', lat: 30.316, lon: 78.032 },
  { name: 'Haridwar', lat: 29.945, lon: 78.164 },
  { name: 'Roorkee', lat: 29.867, lon: 77.889 },
  { name: 'Haldwani', lat: 29.222, lon: 79.513 },
  { name: 'Rudrapur', lat: 28.976, lon: 79.400 },
  { name: 'Rishikesh', lat: 30.087, lon: 78.269 },
  { name: 'Nainital', lat: 29.381, lon: 79.463 },
  // Chandigarh
  { name: 'Chandigarh', lat: 30.733, lon: 76.779 },
  // Jammu & Kashmir
  { name: 'Srinagar', lat: 34.083, lon: 74.797 },
  { name: 'Jammu', lat: 32.726, lon: 74.857 },
  { name: 'Anantnag', lat: 33.731, lon: 75.152 },
  { name: 'Baramulla', lat: 34.197, lon: 74.365 },
  // Assam & Northeast
  { name: 'Guwahati', lat: 26.144, lon: 91.736 },
  { name: 'Silchar', lat: 24.827, lon: 92.797 },
  { name: 'Dibrugarh', lat: 27.480, lon: 94.912 },
  { name: 'Jorhat', lat: 26.758, lon: 94.203 },
  { name: 'Tezpur', lat: 26.634, lon: 92.800 },
  { name: 'Imphal', lat: 24.817, lon: 93.944 },
  { name: 'Shillong', lat: 25.578, lon: 91.893 },
  { name: 'Agartala', lat: 23.831, lon: 91.286 },
  { name: 'Aizawl', lat: 23.727, lon: 92.718 },
  { name: 'Kohima', lat: 25.674, lon: 94.111 },
  { name: 'Itanagar', lat: 27.085, lon: 93.606 },
  { name: 'Gangtok', lat: 27.339, lon: 88.612 },
  // Goa
  { name: 'Panaji', lat: 15.499, lon: 73.824 },
  { name: 'Margao', lat: 15.274, lon: 73.958 },
  { name: 'Vasco da Gama', lat: 15.398, lon: 73.814 },
  // Others
  { name: 'Puducherry', lat: 11.934, lon: 79.830 },
  { name: 'Port Blair', lat: 11.668, lon: 92.746 },
  { name: 'Leh', lat: 34.166, lon: 77.584 },
  { name: 'Daman', lat: 20.414, lon: 72.832 },
  // International
  { name: 'Other (International)', lat: 28.614, lon: 77.209 },
]

const LOAD_TEXTS = [
  'Reading the celestial positions...',
  'Applying Lahiri Ayanamsha...',
  'Calculating your Lagna...',
  'Mapping the 27 Nakshatras...',
  'Computing Vimshottari Dasha...',
  'Weaving your cosmic blueprint...',
]

export default function ChartPage() {
  const { chart, userName, setChart, system, setSystem, user } = useStore()
  const [form, setForm] = useState({
    name: '', dob: '', tob: '12:00',
    city: 'Mumbai', lat: 19.076, lon: 72.877, gender: ''
  })
  const [citySearch, setCitySearch] = useState('Mumbai')
  const [showCityList, setShowCityList] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadText, setLoadText] = useState('')
  const [activeTab, setActiveTab] = useState('chart')
  const [err, setErr] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Close city dropdown on outside click
  useEffect(() => {
    const handleClick = () => setShowCityList(false)
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  // Auto-load saved chart when user logs in
  useEffect(() => {
    if (!user || chart) return
    const load = async () => {
      try {
        const saved = await loadUserChart()
        if (saved && saved.chart_data) {
          setChart(saved.chart_data, {
            dob: saved.dob,
            tob: saved.tob,
            city: saved.city,
            lat: saved.lat,
            lon: saved.lon,
          }, saved.name, saved.id)
        }
      } catch (e) {
        console.log('No saved chart found')
      }
    }
    load()
  }, [user])

  const generate = async () => {
    if (!form.dob) { setErr('Please enter your date of birth'); return }
    if (!form.tob) { setErr('Please enter your time of birth'); return }
    setErr(''); setLoading(true)
    let i = 0
    setLoadText(LOAD_TEXTS[0])
    const intv = setInterval(() => {
      i = (i + 1) % LOAD_TEXTS.length
      setLoadText(LOAD_TEXTS[i])
    }, 650)
    try {
      const result = await generateChart(
        form.dob, form.tob, form.lat, form.lon, system, form.name
      )
      if (user) {
        try {
          const saved = await saveChart(result, form, form.name)
          setChart(result, form, form.name, saved?.id)
        } catch (e) {
          console.log('Chart save skipped:', e.message)
          setChart(result, form, form.name)
        }
      } else {
        setChart(result, form, form.name)
      }
      setActiveTab('chart')
    } catch (err) {
      setErr('Chart generation failed. Please try again.')
      console.error(err)
    } finally {
      clearInterval(intv)
      setLoading(false)
    }
  }

  const mp = chart ? MOON_PHASES[chart.moonPhaseIndex] : null

  return (
    <main style={{ position: 'relative', zIndex: 2, paddingTop: 80 }}>
      <div className="section-wrap">

        <div className={styles.header}>
          <div className="label" style={{ marginBottom: 10 }}>✦ Birth Chart</div>
          <h1 style={{ fontSize: 'clamp(26px,4vw,44px)', marginBottom: 12 }}>Your Cosmic Blueprint</h1>
          <p style={{ color: 'var(--muted)', fontSize: 17, fontStyle: 'italic', maxWidth: 520 }}>
            Real planetary positions calculated using Swiss Ephemeris. Lahiri Ayanamsha applied for Vedic charts.
          </p>
        </div>

        <div className={`card ${styles.formCard}`}>
          <div className={styles.systemToggle}>
            <button className={`${styles.sysBtn} ${system === 'vedic' ? styles.sysBtnActive : ''}`} onClick={() => setSystem('vedic')}>
              🕉 Vedic (Sidereal)
            </button>
            <button className={`${styles.sysBtn} ${system === 'western' ? styles.sysBtnActive : ''}`} onClick={() => setSystem('western')}>
              ☀ Western (Tropical)
            </button>
          </div>

          <div className={styles.formGrid}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
            </div>
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input className="form-input" type="date" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">
                Time of Birth <span style={{ color: 'var(--teal)', fontSize: 11 }}>(exact time = accurate results)</span>
              </label>
              <input className="form-input" type="time" value={form.tob} onChange={e => setForm(f => ({ ...f, tob: e.target.value }))} />
            </div>

            {/* Searchable City Input */}
            <div className="form-group" style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
              <label className="form-label">Birth City</label>
              <input
                className="form-input"
                placeholder="Type your city name..."
                value={citySearch}
                onChange={e => {
                  setCitySearch(e.target.value)
                  setForm(f => ({ ...f, city: e.target.value }))
                  setShowCityList(true)
                }}
                onFocus={() => setShowCityList(true)}
                autoComplete="off"
              />
              {showCityList && citySearch.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200,
                  background: '#0d0b1f', border: '1px solid rgba(212,168,83,.25)',
                  borderRadius: 12, maxHeight: 220, overflowY: 'auto',
                  boxShadow: '0 8px 32px rgba(0,0,0,.6)', marginTop: 4
                }}>
                  {CITIES.filter(c =>
                    c.name.toLowerCase().includes(citySearch.toLowerCase())
                  ).slice(0, 8).map(c => (
                    <div
                      key={c.name}
                      onClick={() => {
                        setForm(f => ({ ...f, city: c.name, lat: c.lat, lon: c.lon }))
                        setCitySearch(c.name)
                        setShowCityList(false)
                      }}
                      style={{
                        padding: '11px 16px', fontSize: 15,
                        color: 'var(--text)', cursor: 'pointer',
                        borderBottom: '1px solid rgba(255,255,255,.04)',
                        transition: 'background .15s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,168,83,.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {c.name}
                    </div>
                  ))}
                  {CITIES.filter(c =>
                    c.name.toLowerCase().includes(citySearch.toLowerCase())
                  ).length === 0 && (
                    <div style={{ padding: '12px 16px', color: 'var(--muted)', fontSize: 14, fontStyle: 'italic' }}>
                      No city found — try a nearby major city
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select className="form-input" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group" style={{ justifyContent: 'flex-end' }}>
              {err && <p style={{ color: 'var(--rose)', fontSize: 13, marginBottom: 8 }}>{err}</p>}
              {user ? (
                <button className="btn-primary" style={{ width: '100%', textAlign: 'center' }} onClick={generate} disabled={loading}>
                  {loading ? loadText : '✦  Generate My Chart'}
                </button>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: 'var(--muted)', fontSize: 14, fontStyle: 'italic', marginBottom: 12 }}>
                    Sign in to generate your cosmic blueprint and save your chart forever.
                  </p>
                  <button className="btn-primary" style={{ width: '100%', textAlign: 'center' }} onClick={() => setShowAuthModal(true)}>
                    ✦ Sign In to Generate Chart
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="spinner" style={{ marginBottom: 24 }} />
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--muted)', animation: 'pulse 1.5s ease-in-out infinite' }}>
              {loadText}
            </p>
          </div>
        )}

        {chart && !loading && (
          <div className={styles.results}>

            <div className={styles.identityStrip}>
              <div className={styles.idMain}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px,3vw,28px)', color: 'var(--gold2)', marginBottom: 6 }}>
                  {userName || 'Your'}'s Cosmic Blueprint
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, color: 'var(--muted2)' }}>
                  {system === 'vedic' ? 'Vedic · Lahiri Ayanamsha' : 'Western · Tropical Zodiac'} · {form.dob ? new Date(form.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''} · {form.tob} · {form.city}
                </div>
              </div>
              <div className={styles.idSigns}>
                {[
                  { label: 'Sun Sign', val: `${SIGN_SYMBOLS[chart.planets[0].signIdx]} ${chart.sunSign}` },
                  { label: 'Moon Sign', val: `${SIGN_SYMBOLS[chart.planets[1].signIdx]} ${chart.moonSign}` },
                  { label: 'Ascendant', val: `${chart.lagnaSymbol} ${chart.lagnaName}` },
                  { label: 'Nakshatra', val: `${chart.moonNakshatra.symbol} ${chart.moonNakshatra.name}` },
                ].map(s => (
                  <div key={s.label} className={styles.idSign}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 2, color: 'var(--muted2)', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--gold)' }}>{s.val}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => downloadChartPDF(chart, userName, form)}
                style={{
                  padding: '10px 20px', borderRadius: 100,
                  border: '1px solid rgba(212,168,83,.3)',
                  background: 'rgba(212,168,83,.08)',
                  color: 'var(--gold)', fontFamily: 'var(--font-serif)',
                  fontSize: 13, cursor: 'pointer',
                  display: 'flex', alignItems: 'center',
                  gap: 8, transition: 'all .2s',
                  whiteSpace: 'nowrap', alignSelf: 'center'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,168,83,.16)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,168,83,.08)'}
              >
                ↓ Download PDF
              </button>
            </div>

            <div className="tabs">
              {['chart', 'planets', 'dasha', 'nakshatra', 'chat'].map(t => (
                <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                  {t === 'chart' ? '🔮 Birth Chart' : t === 'planets' ? '🪐 Planets' : t === 'dasha' ? '📅 Dasha' : t === 'nakshatra' ? '⭐ Nakshatra' : '🤖 Astro Chat'}
                </button>
              ))}
            </div>

            {activeTab === 'chart' && (
              <div className={styles.chartTab}>
                <div className={styles.chartLeft}>
                  <div className="card" style={{ padding: 24 }}>
                    <ChartWheel chart={chart} size={420} />
                  </div>
                  <div className={styles.chartLegend}>
                    {chart.planets.map(p => (
                      <div key={p.id} className={styles.legendItem}>
                        <span style={{ fontSize: 18 }}>{p.symbol}</span>
                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: 13 }}>{p.name}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--gold)', marginLeft: 'auto' }}>H{p.house}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.chartRight}>
                  <div className={styles.quickStats}>
                    <div className={styles.qs}>
                      <div className={styles.qsLabel}>Current Dasha</div>
                      <div className={styles.qsVal}>{chart.currentDasha.planet}</div>
                      <div className={styles.qsSub}>Until {Math.floor(chart.currentDasha.endYear)}</div>
                    </div>
                    <div className={styles.qs}>
                      <div className={styles.qsLabel}>Moon Phase</div>
                      <div className={styles.qsVal}>{mp?.emoji}</div>
                      <div className={styles.qsSub}>{mp?.name}</div>
                    </div>
                    <div className={styles.qs}>
                      <div className={styles.qsLabel}>Lucky Numbers</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                        {chart.luckyNums.map(n => (
                          <span key={n} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--gold-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--gold)' }}>{n}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={styles.lifeAreas}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Life Area Strengths</div>
                    {[
                      { label: 'Love & Relations', score: 60 + ((chart.planets[0].signIdx * 7 + chart.planets[1].signIdx * 11) % 32), color: 'var(--rose)' },
                      { label: 'Career & Purpose', score: 65 + ((chart.planets[0].signIdx * 5 + chart.lagnaSign * 9) % 28), color: 'var(--gold)' },
                      { label: 'Health & Energy', score: 68 + (chart.planets[1].signIdx * 6 % 24), color: 'var(--teal)' },
                      { label: 'Wealth & Abundance', score: 62 + (chart.planets[5].signIdx * 7 % 30), color: 'var(--green)' },
                      { label: 'Spiritual Growth', score: 70 + (chart.moonNakshatra.name.length % 22), color: 'var(--violet)' },
                    ].map(a => (
                      <div key={a.label} className="score-bar-wrap" style={{ marginBottom: 12 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', width: 130, flexShrink: 0 }}>{a.label}</span>
                        <div className="score-bar-track">
                          <div className="score-bar-fill" style={{ width: `${a.score}%`, background: a.color }} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text)', width: 36, textAlign: 'right', flexShrink: 0 }}>{a.score}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'planets' && (
              <div className={styles.planetsGrid}>
                {chart.planets.map((p, i) => (
                  <div key={p.id} className={`card ${styles.planetCard}`}>
                    <div className={styles.pcTop}>
                      <span style={{ fontSize: 28 }}>{p.symbol}</span>
                      <div>
                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted2)', letterSpacing: 2 }}>{p.vedic}</div>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px', borderRadius: 6, background: 'rgba(212,168,83,.1)', border: '1px solid rgba(212,168,83,.2)', color: 'var(--gold)', marginLeft: 'auto' }}>H{p.house}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--gold)', marginBottom: 8 }}>
                      {p.degInSign}° {p.sign} {p.signSymbol}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--teal)', marginBottom: 10 }}>
                      {p.nakshatra.name} · Pada {p.pada}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>{PLANET_DESCS[i]}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'dasha' && (
              <div>
                <div className={styles.dashaMain}>
                  <div className="label" style={{ marginBottom: 8 }}>Current Mahadasha</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,4vw,36px)', color: 'var(--gold2)', marginBottom: 6 }}>
                    {chart.currentDasha.planet} Dasha
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', marginBottom: 16 }}>
                    {Math.floor(chart.currentDasha.startYear)} — {Math.floor(chart.currentDasha.endYear)} · {chart.currentDasha.years} year period
                  </div>
                  <p style={{ fontSize: 17, color: 'var(--muted)', lineHeight: 1.85, fontStyle: 'italic', maxWidth: 680 }}>
                    {DASHA_DESC[chart.currentDasha.planet]}
                  </p>
                </div>
                <div style={{ marginTop: 24 }}>
                  <div className="label" style={{ marginBottom: 16 }}>Complete Dasha Timeline</div>
                  {chart.dashaTimeline.map((d, i) => {
                    const now = new Date().getFullYear() + new Date().getMonth() / 12
                    const isActive = now >= d.startYear && now < d.endYear
                    const isPast = now >= d.endYear
                    const pct = isActive ? Math.min(100, ((now - d.startYear) / d.years) * 100) : isPast ? 100 : 0
                    return (
                      <div key={i} className={`${styles.dashaItem} ${isActive ? styles.dashaActive : ''}`}>
                        <div className={`${styles.dashaDot} ${isActive ? styles.dashaDotActive : ''}`} />
                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, width: 90, color: isActive ? 'var(--gold)' : 'var(--text)' }}>{d.planet}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', flex: 1 }}>
                          {Math.floor(d.startYear)} — {Math.floor(d.endYear)} · {d.years}yr
                        </div>
                        <div style={{ width: 80, height: 4, borderRadius: 99, background: 'rgba(255,255,255,.06)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: isActive ? 'var(--gold)' : 'rgba(212,168,83,.3)', borderRadius: 99 }} />
                        </div>
                        {isActive && <span className="free-badge" style={{ marginLeft: 8 }}>NOW</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {activeTab === 'nakshatra' && (
              <div>
                <div className={styles.nkCard}>
                  <div style={{ fontSize: 52, marginBottom: 14 }}>{chart.moonNakshatra.symbol}</div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(22px,4vw,32px)', fontWeight: 700, color: 'var(--teal)', marginBottom: 6 }}>
                    {chart.moonNakshatra.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, color: 'var(--muted2)', marginBottom: 16 }}>
                    Ruled by {chart.moonNakshatra.ruler} · Pada {chart.planets[1].pada} · Moon in {chart.moonSign}
                  </div>
                  <p style={{ fontSize: 17, lineHeight: 1.85, color: 'var(--muted)', fontStyle: 'italic', maxWidth: 640 }}>
                    {chart.moonNakshatra.desc}
                  </p>
                </div>
                <div style={{ marginTop: 28 }}>
                  <div className="label" style={{ marginBottom: 16 }}>All Planetary Nakshatras</div>
                  <div className={styles.nkGrid}>
                    {chart.planets.map(p => (
                      <div key={p.id} className="card" style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ fontSize: 18 }}>{p.symbol}</span>
                          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 13, fontWeight: 600 }}>{p.name}</span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--gold)', marginBottom: 3 }}>{p.nakshatra.name}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted2)' }}>Pada {p.pada} · {p.nakshatra.ruler}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 600, marginBottom: 8 }}>
                    Chart-Aware AI Astrologer
                  </div>
                  <p style={{ fontSize: 15, color: 'var(--muted)' }}>
                    Every response is personalised using your actual planetary positions. First 3 messages free — then upgrade for unlimited access.
                  </p>
                </div>
                <AstroChat chart={chart} userName={userName} />
              </div>
            )}

          </div>
        )}
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </main>
  )
}
