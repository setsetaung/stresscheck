<template>
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
            <radio :question="question" :answers="answers" />
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
            btn
            @click="next"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import { collection, onSnapshot } from '@firebase/firestore'
import { db } from '../plugins/firebase'
import radio from '~/components/radio.vue'
const questionCollectionRef = collection(db, 'Questions')
const answerCollectionRef = collection(db, 'Answer')

export default {
  name: 'StressCheckerPage',
  components: { radio },
  middleware: 'authenticated',
  data () {
    return {
      questions: [],
      question_text: '',
      answers: [],
      answer_text: '',
      score: '',
      onboarding: 0
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
  },
  methods: {
    next () {
      this.onboarding = this.onboarding + 1 === this.questions.length
        ? 0
        : this.onboarding + 1
    },
    prev () {
      this.onboarding = this.onboarding - 1 < 0
        ? this.questions.length - 1
        : this.onboarding - 1
    }
  }
}
</script>
<style scoped>
</style>
