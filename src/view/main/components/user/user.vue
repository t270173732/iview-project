<template>
    <div class="user-avator-dropdown">
        <Dropdown @on-click="handleClick">
            <span class="main-user-name">{{ userName }}</span>
            <Icon :size="18" type="md-arrow-dropdown"></Icon>
            <DropdownMenu slot="list">
                <DropdownItem name="logout">退出登录</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
    import './user.less'
    import {mapActions} from 'vuex'
    import Cookies from 'js-cookie'

    export default {
        name: 'User',
        props: {
            userAvator: {
                type: String,
                default: ''
            }
        },
        data() {
            return {

            }
        },
        computed:{
            userName(){
                return this.$store.state.app.userName;
            },
        },
        mounted() {

        },
        methods: {
            ...mapActions([
                'handleLogOut'
            ]),
            handleClick(name) {
                this.$emit('log-out')
            }
        }
    }
</script>
