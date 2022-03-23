<template>
  <div v-if="user">
    <v-container class="pt-15 text-center">
      <div class="pt-10">
        <v-row>
          <v-col>
            <h1>Stress Check Result</h1>
            <h2>{{ user.displayName }}さん</h2>
          </v-col>
        </v-row>
        <v-row v-if="results.length !== 0">
          <v-col>
            <v-card
              class="overflow-y-auto mx-auto"
              max-height="auto"
              max-width="500"
            >
              <v-card-subtitle v-for="result in results" :key="result.id">
                {{ Number(result.total_B) >= 770 || (Number(result.total_B) >= 630 && Number(result.total_A + result.total_C) >= 760) ? '高ストレス' : '異常なし' }}
                {{ $dateFns.format(result.created_at.toDate(), 'YYYY年MM月DD日hh時mm分') }}
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col>
            <h4>You don't have past stress check result.Please check</h4>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn to="/stresscheck" color="dark" large nuxt>
              Start Stress Check
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
  <div v-else>
    <login />
  </div>
</template>

<script>
import { collection, onSnapshot, query, where, orderBy } from '@firebase/firestore'
import { db } from '../plugins/firebase'

const resultCollectionRef = collection(db, 'Result')
const q = query(resultCollectionRef, orderBy('created_at', 'desc'))
export default {
  name: 'ResultPage',
  middleware: 'authenticated',
  data () {
    return {
      results: []
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  mounted () {
    setTimeout(() => {
      const que = query(q, where('user_id', '==', this.user.uid))
      onSnapshot(que, (querySnapshot) => {
        this.results = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      })
    }, 1000)
  },
  methods: {
  }
}
</script>
<style scoped>
</style>
