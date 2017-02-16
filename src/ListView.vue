<template>
  <div>
    <ul class="nav nav-tabs">
      <li role="presentation" class="active"><router-link :to="{ name: 'list', params: { category: 'home'}}">Home</router-link></li>
      <li role="presentation"><a href="#">Profile</a></li>
      <li role="presentation"><a href="#">Messages</a></li>
    </ul>
    <p>{{category}}</p>
    <p>{{channels}}</p>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'

export default {
  props: ['category', 'channels'],
  name: 'list-view',
}
</script>
