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
          <v-window v-model="onboarding" class="slide-window">
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
import Login from './login.vue'
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
      total_score: ''
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
      this.onboarding = this.onboarding + 1 === this.questions.length
        ? 0
        : this.onboarding + 1
      this.onboarding + 1 === this.questions.length
        ? this.check = true
        : this.check = false
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
      this.Questionsdata(qusData)
    },
    Questionsdata (qusData) {
      const question = {
        questionId: qusData.questionId,
        value: qusData.radioGroup === '' ? 0 : qusData.radioGroup
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
      const total = this.selectedData.reduce((pre, cur) => pre + Number(cur.value), 0)
      addDoc(resultCollectionRef, {
        user_id: this.user.uid,
        username: this.user.displayName,
        total_score: total,
        created_at: serverTimestamp()
      }).then(() => {
        this.$router.push('/Home')
        this.selectedData = []
      })
    }
  }
}
</script>
<style scoped>
</style>
