<template>
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
            />
          </div>
        </div>
      </v-radio-group>
    </v-row>
  </v-card>
</template>
<script>
export default {
  name: 'RadioPage',
  props: {
    question: {
      type: Object, default: null
    },
    answers: {
      type: Array, default: null
    }
  },
  data () {
    return {
      radioGroup: '',
      questionId: this.question.id
    }
  },
  updated () {
    this.$emit('selected', { radioGroup: this.radioGroup, questionId: this.question.id })
  }
}
</script>

<style>

</style>
