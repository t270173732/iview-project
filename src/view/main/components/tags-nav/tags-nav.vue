<template>
    <div class="tags-nav">
        <ul v-show="visible" :style="{left: contextMenuLeft + 'px', top: contextMenuTop + 'px'}" class="contextmenu">
            <li v-for="(item, key) of menuList" @click="handleTagsOption(key)" :key="key">{{item}}</li>
        </ul>
        <div class="btn-con left-btn">
            <Button type="text" @click="handleScroll(240)">
                <Icon :size="18" type="ios-arrow-back"/>
            </Button>
        </div>
        <div class="btn-con right-btn">
            <Button type="text" @click="handleScroll(-240)">
                <Icon :size="18" type="ios-arrow-forward"/>
            </Button>
        </div>
        <div class="btn-con down-btn">
            <Dropdown transfer @on-click="handleTagsOption" placement="bottom-end">
                <Button type="text">
                    <Icon :size="18" type="ios-arrow-down"/>
                </Button>
                <DropdownMenu slot="list">
                    <DropdownItem name="all">关闭所有</DropdownItem>
                    <DropdownItem name="others">关闭其他</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
        <div class="scroll-outer" ref="scrollOuter" @DOMMouseScroll="handlescroll" @mousewheel="handlescroll">
            <ul ref="scrollBody" class="layui-tab-title" :style="{left: tagBodyLeft + 'px'}">
                <li
                        ref="tagsPageOpened"
                        v-for="(item, index) in list"
                        :key="`tag-nav-${index}`"
                        :name='item.name'
                        @click="handleClick(item)"
                        :class="isCurrentTag(item) ? 'layui-this' : ''"
                        @contextmenu.prevent.native="contextMenu(item, $event)"
                >
                    <span>{{ showTitleInside(item) }}</span>
                    <a href="javascript:void(0)" @click.stop="handleClose(item)" v-if="index !=0"
                       class=" layui-tab-close">
                        <i class="layui-icon layui-unselect layui-icon-close"></i>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {showTitle, routeEqual, getParentRouterObjByName} from '@/libs/util'

    export default {
        name: 'TagsNav',
        props: {
            value: Object,
            list: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        data() {
            return {
                currentPageName: this.$route.name,
                tagBodyLeft: 0,
                rightOffset: 40,
                outerPadding: 4,
                contextMenuLeft: 0,
                contextMenuTop: 0,
                visible: false,
                refsTag: [],
                menuList: {
                    others: '关闭其他',
                    all: '关闭所有'
                }
            }
        },
        computed: {
            currentRouteObj() {
                let currentRouteObj = this.value
                if (this.value.meta.detail) {
                    let parent = getParentRouterObjByName(this.$store.state.app.routers, this.value.name)
                    for (let i = 0; i < parent.children.length; i++) {
                        if (parent.children[i].meta.index) {
                            currentRouteObj = parent.children[i]
                        }
                    }
                }
                return currentRouteObj
            }
        },
        methods: {
            handlescroll(e) {
                var type = e.type
                let delta = 0
                if (type === 'DOMMouseScroll' || type === 'mousewheel') {
                    delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40
                }
                this.handleScroll(delta)
            },
            handleScroll(offset) {
                const outerWidth = this.$refs.scrollOuter.offsetWidth
                const bodyWidth = this.$refs.scrollBody.offsetWidth
                if (offset > 0) {
                    this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset)
                    // this.tagBodyLeft = 0
                } else {
                    if (outerWidth < bodyWidth) {
                        if (this.tagBodyLeft < -(bodyWidth - outerWidth)) {
                            this.tagBodyLeft = this.tagBodyLeft
                        } else {
                            this.tagBodyLeft = Math.max(this.tagBodyLeft + offset, outerWidth - bodyWidth)
                        }
                    } else {
                        this.tagBodyLeft = 0
                    }
                    // this.tagBodyLeft = Math.min(0, -(this.refsTag[this.refsTag.length - 1].offsetLeft + this.refsTag[this.refsTag.length - 1].offsetWidth - bodyWidth + this.outerPadding))
                }
            },
            handleTagsOption(type) {
                if (type === 'all') {
                    // 关闭所有，除了home
                    let res = this.list.filter(item => item.name === 'home')
                    this.$emit('on-close', res, 'all')
                } else if (type === 'others') {
                    // 关闭除当前页和home页的其他页
                    let res = this.list.filter(item => routeEqual(this.currentRouteObj, item) || item.name === 'home')
                    this.$emit('on-close', res, 'others', this.currentRouteObj)
                    setTimeout(() => {
                        this.getTagElementByName(this.currentRouteObj.name)
                    }, 100)
                }
            },
            handleClose(current) {
                let res = this.list.filter(item => !routeEqual(current, item))
                this.$emit('on-close', res, undefined, current)
            },
            handleClick(item) {
                this.$emit('input', item)
            },
            showTitleInside(item) {
                return showTitle(item, this)
            },
            isCurrentTag(item) {
                return routeEqual(this.currentRouteObj, item)
            },
            moveToView(tag) {
                const outerWidth = this.$refs.scrollOuter.offsetWidth
                const bodyWidth = this.$refs.scrollBody.offsetWidth
                if (bodyWidth < outerWidth) {
                    this.tagBodyLeft = 0
                } else if (tag.offsetLeft < -this.tagBodyLeft) {
                    // 标签在可视区域左侧
                    this.tagBodyLeft = -tag.offsetLeft + this.outerPadding
                } else if (tag.offsetLeft > -this.tagBodyLeft && tag.offsetLeft + tag.offsetWidth < -this.tagBodyLeft + outerWidth) {
                    // 标签在可视区域
                    this.tagBodyLeft = Math.min(0, outerWidth - tag.offsetWidth - tag.offsetLeft - this.outerPadding)
                } else {
                    // 标签在可视区域右侧
                    this.tagBodyLeft = -(tag.offsetLeft - (outerWidth - this.outerPadding - tag.offsetWidth))
                }
            },
            getTagElementByName(name) {
                this.$nextTick(() => {
                    this.refsTag = this.$refs.tagsPageOpened
                    this.refsTag.forEach((item, index) => {
                        if (name === item.attributes.name.value) {
                            let tag = this.refsTag[index]
                            this.moveToView(tag)
                        }
                    })
                })
            },
            contextMenu(item, e) {
                if (item.name === 'home') {
                    return
                }
                this.visible = true
                const offsetLeft = this.$el.getBoundingClientRect().left
                this.contextMenuLeft = e.clientX - offsetLeft + 10
                this.contextMenuTop = e.clientY - 64
            },
            closeMenu() {
                this.visible = false
            }
        },
        watch: {
            '$route'(to) {
                this.getTagElementByName(to.name)
            },
            visible(value) {
                if (value) {
                    document.body.addEventListener('click', this.closeMenu)
                } else {
                    document.body.removeEventListener('click', this.closeMenu)
                }
            }
        },
        mounted() {
            this.refsTag = this.$refs.tagsPageOpened
            setTimeout(() => {
                this.getTagElementByName(this.$route.name)
            }, 200)
        }
    }
</script>

<style lang="less">
    @import './tags-nav.less';
</style>
