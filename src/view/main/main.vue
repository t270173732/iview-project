<template>
    <Layout style="height: 100%" class="main">
        <Sider hide-trigger collapsible :width="240" :collapsed-width="60" v-model="collapsed" class="left-sider"
               :style="{overflow: 'hidden'}">
            <side-menu accordion ref="sideMenu" :active-name="activeName" :collapsed="collapsed"
                       @on-select="turnToPage" :menu-list="menuList">
                <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
                <div class="logo-con">
                    <img v-show="!collapsed" :src="maxLogo" key="max-logo"/>
                    <img v-show="collapsed" :src="minLogo" key="min-logo"/>
                </div>
            </side-menu>
        </Sider>
        <Layout>
            <Header class="header-con">
                <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
                    <!--<div>-->
                        <!--<a href="javascript:void(0)" @click.prevent="moreClick">-->
                            <!--<i class="layui-icon layui-icon-more-vertical" style="font-size: 20px;line-height: 64px;"-->
                               <!--v-show="!isMore"></i>-->
                            <!--<i class="layui-icon layui-icon-more" style="font-size: 20px;line-height: 64px;"-->
                               <!--v-show="isMore"></i>-->
                        <!--</a>-->
                    <!--</div>-->
                    <user :user-avator="userAvator" @log-out="logout" style="margin-right: 10px;"/>
                    <!--<language @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local"/>-->
                    <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
                </header-bar>
            </Header>
            <div class="main-header-more" :style="{right: isMore?'0':'-300px'}"></div>
            <Content class="main-content-con">
                <Layout class="main-layout-con">
                    <div class="tag-nav-wrapper">
                        <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
                    </div>
                    <Content class="content-wrapper">
                        <!-- <keep-alive :include="cacheList">
                            <router-view/>
                        </keep-alive> -->
                        <router-view/>
                    </Content>
                </Layout>
            </Content>
        </Layout>
    </Layout>
</template>
<script>
    import SideMenu from './components/side-menu'
    import HeaderBar from './components/header-bar'
    import TagsNav from './components/tags-nav'
    import User from './components/user'
    import Fullscreen from './components/fullscreen'
    import Language from './components/language'
    import {mapMutations, mapActions} from 'vuex'
    import {getNewTagList, getNextRoute, routeEqual, getParentRouterObjByName, getRouterObjByName} from '@/libs/util'
    import minLogo from '@/assets/images/logo-min.png'
    import maxLogo from '@/assets/images/logo.png'
    import './main.less'

    export default {
        name: 'Main',
        components: {
            SideMenu,
            HeaderBar,
            Language,
            TagsNav,
            Fullscreen,
            User
        },
        data() {
            return {
                isMore: false,
                collapsed: false,
                minLogo,
                maxLogo,
                isFullscreen: false
            }
        },
        computed: {
            activeName(){
                let name;
                if(this.$route.meta.detail || this.$route.meta.index){
                    let parent = getParentRouterObjByName(this.$store.state.app.routers, this.$route.name)
                    // for (let i = 0; i < parent.children.length; i++) {
                    //     if (parent.children[i].meta.index) {
                    //         name = parent.children[i].name
                    //     }
                    // }
                    name = parent.name
                }else{
                    name = this.$route.name
                }
                return name
            },
            tagNavList() {
                return this.$store.state.app.tagNavList
            },
            tagRouter() {
                return this.$store.state.app.tagRouter
            },
            userAvator() {
                return this.$store.state.user.avatorImgPath
            },
            cacheList() {
                return this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []
            },
            menuList() {
                return this.$store.state.app.menuList
                // return this.$store.getters.menuList
            },
            local() {
                return this.$store.state.app.local
            }
        },
        methods: {
            ...mapMutations([
                'setBreadCrumb',
                'setTagNavList',
                'addTag',
                'setLocal'
            ]),
            ...mapActions([
                'handleLogin'
            ]),
            turnToPage(route) {
                // let routeObj = getRouterObjByName(this.$store.state.app.routers,route)
                // if(!routeObj.children){
                let {name, params, query} = {}
                if (typeof route === 'string') name = route
                else {
                    name = route.name
                    params = route.params
                    query = route.query
                }
                if (name.indexOf('isTurnByHref_') > -1) {
                    window.open(name.split('_')[1])
                    return
                }
                this.$router.push({
                    name,
                    params,
                    query
                })
                // }
            },
            handleCollapsedChange(state) {
                this.collapsed = state
            },
            handleCloseTag(res, type, route) {
                let openName = ''
                let nameObj = this.$route
                if (this.$route.meta.detail) {
                    let parent = getParentRouterObjByName(this.$store.state.app.routers, nameObj.name)
                    for (let i = 0; i < parent.children.length; i++) {
                        if (parent.children[i].meta.index) {
                            nameObj = parent.children[i]
                        }
                    }
                }
                if (type === 'all') {
                    this.turnToPage('home')
                    openName = 'home'
                } else if (routeEqual(nameObj, route)) {
                    if (type === 'others') {
                        openName = route.name
                    } else {
                        const nextRoute = getNextRoute(this.tagNavList, route)
                        this.$router.push(nextRoute)
                        openName = nextRoute.name
                    }
                }
                this.setTagNavList(res)
                this.$refs.sideMenu.updateOpenName(openName)
            },
            handleClick(item) {
                this.turnToPage(item)
            },
            moreClick() {
                this.isMore = !this.isMore
            },
            logout(){
                this.$store.commit('logout', this);
                this.$router.push({
                    name: 'login'
                })
            }
        },
        watch: {
            '$route'(newRoute) {
                this.setBreadCrumb(newRoute.matched)
                if (newRoute.name.indexOf('router') < 0 && !newRoute.meta.detail) {
                    this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
                }

            }
        },
        mounted() {
            /**
             * @description 初始化设置面包屑导航和标签导航
             */
            this.setTagNavList()
            this.addTag({
                route: this.$store.state.app.homeRoute
            })
            this.setBreadCrumb(this.$route.matched)
            // 设置初始语言
            this.setLocal(this.$i18n.locale)
        }
    }
</script>
