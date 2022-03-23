<template>
  <div v-if="user">
    <v-container class="pt-15 text-center">
      <div class="pt-10">
        <v-row>
          <v-col>
            <h1>Stress Checker</h1>
          </v-col>
        </v-row>
      </div>
      <v-card color="grey">
        <div class="pt-5">
          <div class="text-right">
            {{ onboarding + 1 }} / {{ questions.length }}
          </div>
          <p v-if="onboarding > -1 && onboarding < 17" class=" text-h6">
            Ａ  あなたの仕事についてうかがいます。最もあてはまるものに○を付けてください。
          </p>
          <p v-if="onboarding > 16 && onboarding < 46" class=" text-h6">
            Ｂ  最近1 か月間のあなたの状態についてうかがいます。最もあてはまるものに○を付けてください。
          </p>
          <p v-if="onboarding > 45 && onboarding < 49" class=" text-h6">
            Ｃ  あなたの周りの方々についてうかがいます。最もあてはまるものに○を付けてください
            次の人たちはどのくらい気軽に話ができますか?
          </p>
          <p v-if="onboarding > 48 && onboarding < 52" class=" text-h6">
            Ｃ  あなたの周りの方々についてうかがいます。最もあてはまるものに○を付けてください
            あなたが困った時、次の人たちはどのくらい頼りになりますか？
          </p>
          <p v-if="onboarding > 51 && onboarding < 55" class=" text-h6">
            Ｃ  あなたの周りの方々についてうかがいます。最もあてはまるものに○を付けてください
            あなたが困った時、次の人たちはどのくらい頼りになりますか？
          </p>
          <p v-else-if="onboarding > 54 && onboarding < 57" class=" text-h6">
            Ｄ  満足度について
          </p>
          <v-window v-model="onboarding" class="slide-window" :touch="{ left : next, right: prev }">
            <v-window-item
              v-for="(question, index) in questions"
              :key="`card-${index}`"
            >
              <radio :question="question" :answers="answers" @selected="getselected($event)" />
            </v-window-item>
          </v-window>
          <v-card-actions class="justify-space-between">
            <v-btn
              btn
              @click="prev"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn
              v-if="!check"
              btn
              @click="next"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn
              v-if="check"
              btn
              @click="stresscheck"
            >
              Check!
            </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-container>
  </div>
  <div v-else>
    <login />
  </div>
</template>

<script>
import { addDoc, collection, onSnapshot } from '@firebase/firestore'
import { serverTimestamp } from 'firebase/firestore'
import { db } from '../plugins/firebase'
import Login from '../components/login.vue'
import radio from '~/components/radio.vue'
const questionCollectionRef = collection(db, 'Questions')
const answerCollectionRef = collection(db, 'Answer')
const resultCollectionRef = collection(db, 'Result')

export default {
  name: 'StressCheckerPage',
  components: { radio, Login },
  middleware: 'authenticated',
  data () {
    return {
      questions: [],
      question_text: '',
      answers: [],
      answer_text: '',
      score: '',
      onboarding: 0,
      selectedData: [],
      results: [],
      total_A: '',
      total_B: '',
      total_C: '',
      total_D: '',
      check: false,
      qusData: ''
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  mounted () {
    onSnapshot(questionCollectionRef, (querySnapshot) => {
      this.questions = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    })
    onSnapshot(answerCollectionRef, (querySnapshot) => {
      this.answers = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    })
    onSnapshot(resultCollectionRef, (querySnapshot) => {
      this.results = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    })
  },
  methods: {
    next () {
      if (this.qusData === '' || this.qusData.radioGroup === '') {
        const index = this.selectedData.findIndex(qus => qus.onboarding === this.onboarding && qus.value !== 0)
        if (index === -1) {
          alert('Select Answer')
        } else {
          this.onboarding = this.onboarding + 1 === this.questions.length
            ? 0
            : this.onboarding + 1
          this.onboarding + 1 === this.questions.length
            ? this.check = true
            : this.check = false
          this.qusData = ''
        }
      } else {
        this.onboarding = this.onboarding + 1 === this.questions.length
          ? 0
          : this.onboarding + 1
        this.onboarding + 1 === this.questions.length
          ? this.check = true
          : this.check = false
        this.qusData = ''
      }
    },
    prev () {
      this.onboarding = this.onboarding - 1 < 0
        ? this.questions.length - 1
        : this.onboarding - 1
      this.onboarding + 1 === this.questions.length
        ? this.check = true
        : this.check = false
    },
    getselected (qusData) {
      this.qusData = qusData
      this.Questionsdata(qusData)
    },
    Questionsdata (qusData) {
      const question = {
        questionId: qusData.questionId,
        value: qusData.radioGroup === '' ? 0 : qusData.radioGroup,
        onboarding: this.onboarding
      }
      const data = this.selectedData.filter(q => q.questionId.includes(question.questionId))
      if (data.length === 0) {
        this.selectedData.push(question)
      } else {
        const index = this.selectedData.findIndex(q => q.questionId === question.questionId)
        this.selectedData[index].value = question.value
      }
    },
    stresscheck () {
      const AArray = this.selectedData.filter(ans => ans.questionId.startsWith('Q'))
      this.totalA = AArray.reduce((a, b) => a + Number(b.value), 0)
      const BArray = this.selectedData.filter(ans => ans.questionId.startsWith('R'))
      this.totalB = BArray.reduce((a, b) => a + Number(b.value), 0)
      const CArray = this.selectedData.filter(ans => ans.questionId.startsWith('S'))
      this.totalC = CArray.reduce((a, b) => a + Number(b.value), 0)
      const DArray = this.selectedData.filter(ans => ans.questionId.startsWith('T'))
      this.totalD = DArray.reduce((a, b) => a + Number(b.value), 0)
      if (this.selectedData.length === 57) {
        addDoc(resultCollectionRef, {
          user_id: this.user.uid,
          username: this.user.displayName,
          total_A: this.totalA,
          total_B: this.totalB,
          total_C: this.totalC,
          total_D: this.totalD,
          created_at: serverTimestamp()
        }).then(() => {
          this.$router.push('/result')
          this.selectedData = []
        })
      } else {
        alert('Answer 57問題')
      }
    }
  }
}
</script>
<style scoped>
</style>
