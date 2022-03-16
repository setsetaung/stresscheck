<template>
  <v-container class="pt-15 text-center">
    <div class="pt-10">
      <v-row>
        <v-col>
          <h1>Stress Checker</h1>
        </v-col>
      </v-row>
    </div>
    <v-card color="cyan">
      <div class="pt-5">
        <div class="text-right">
          {{ onboarding + 1 }} / {{ questions.length }}
        </div>
        <v-window v-model="onboarding" class="slide-window">
          <v-window-item
            v-for="(question, index) in questions"
            :key="`card-${index}`"
          >
            <v-card
              color="transparent"
              height="250"
            >
              <v-row
                class="fill-height"
                align="center"
                justify="center"
              >
                <v-card-text class="text-center text-h5">
                  {{ question.question_text }}
                </v-card-text>
                <v-radio-group v-model="radioGroup">
                  <div v-for="answer in answers" :key="answer.id" cols="12">
                    <div v-if="question.id === answer.questions_id.id">
                      <v-radio
                        :label="`${answer.answer_text}`"
                        :value="`${answer.score}`"
                        :v-model="picked"
                      />
                    </div>
                  </div>
                </v-radio-group>
              </v-row>
            </v-card>
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
const questionCollectionRef = collection(db, 'Questions')
const answerCollectionRef = collection(db, 'Answer')

export default {
  name: 'StressCheckerPage',
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
    },
    check () {
      console.log(this.radioGroup)
    }
  }
}
</script>
<style scoped>
</style>
