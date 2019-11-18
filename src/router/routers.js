import Main from '@/view/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

export default [
    {
        path: '/login',
        name: 'login',
        meta: {
            title: 'Login - 登录',
            hideInMenu: true
        },
        component: () => import('@/view/login/newLogin.vue')
    },
    {
        path: '/regist-type',
        name: 'regist-type',
        meta: {
            title: '注册类型',
            hideInMenu: true
        },
        component: () => import('@/view/regist/regist-type/regist.vue')
    },
    {
        path: '/store-regist',
        name: 'store-regist',
        meta: {
            title: '注册',
            hideInMenu: true
        },
        component: () => import('@/view/regist/store-regist/store-regist.vue')
    },
    {
        path: '/regist-success',
        name: 'regist-success',
        meta: {
            title: '注册成功',
            hideInMenu: true
        },
        component: () => import('@/view/regist/regist-success/regist-success.vue')
    },
    {
        path: '/',
        name: '_home',
        redirect: '/home',
        component: Main,
        meta: {
            hideInMenu: true,
            notCache: true
        },
        children: [
            {
                path: '/home',
                name: 'home',
                meta: {
                    hideInMenu: true,
                    title: '首页',
                    notCache: true
                },
                component: () => import('@/view/single-page/home/allHome')
            }
        ]
    },
    // {
    //     path: '/multilevel',
    //     name: 'multilevel',
    //     meta: {
    //         icon: 'md-menu',
    //         title: '多级菜单'
    //     },
    //     component: Main,
    //     children: [
    //         {
    //             path: 'level_2_1',
    //             name: 'level_2_1',
    //             meta: {
    //                 icon: 'md-funnel',
    //                 title: '二级-1'
    //             },
    //             component: () => import('@/view/multilevel/level-2-1.vue')
    //         },
    //         {
    //             path: 'level_2_2',
    //             name: 'level_2_2',
    //             meta: {
    //                 // access: ['super_admin'],
    //                 icon: 'md-funnel',
    //                 showAlways: true,
    //                 title: '二级-2'
    //             },
    //             component: parentView,
    //             children: [
    //                 {
    //                     path: 'level_2_2_1',
    //                     name: 'level_2_2_1',
    //                     meta: {
    //                         icon: 'md-funnel',
    //                         title: '三级'
    //                     },
    //                     component: () => import('@/view/multilevel/level-2-2/level-3-1.vue')
    //                 }
    //             ]
    //         },
    //         {
    //             path: 'level_2_3',
    //             name: 'level_2_3',
    //             meta: {
    //                 icon: 'md-funnel',
    //                 title: '二级-3'
    //             },
    //             component: () => import('@/view/multilevel/level-2-3.vue')
    //         },
    //     ]
    // },
    {
        path: '/info-perfect',
        name: 'info-perfect',
        component: Main,
        meta: {
            icon: 'icon_information2',
            showAlways: true,
            title: '信息完善',
        },
        children:[
            {
                path: 'store-perfect',
                meta: {
                    icon: 'icon_information2',
                    title: '药店信息完善'
                },
                name: 'store-perfect',
                component: () => import('@/view/info-perfect/store-info/store-info.vue')
            }
        ]

    },
    {
        path: '/access',
        name: 'access',
        component: Main,
        meta: {
            icon: 'icon_jurisdiction',
            showAlways: true,
            title: '权限管理',
        },
        children: [
            {
                path: 'role-mgt',
                meta: {
                    icon: 'icon_role',
                    title: '角色管理'
                },
                name: 'role-mgt',
                component: () => import('@/view/access/role-mgt/role-mgt.vue')
            },
            {
                path: 'platform-user',
                meta: {
                    icon: 'icon_user1',
                    title: '平台用户管理'
                },
                name: 'platform-user',
                component: () => import('@/view/access/platform-user/platform-user.vue')
            },
            {
                path: 'org-user',
                meta: {
                    icon: 'icon_user2',
                    title: '机构用户管理'
                },
                name: 'org-user',
                component: () => import('@/view/access/org-user/org-user.vue')
            },
        ]
    },
    {
        path: '/base-data',
        name: 'base-data',
        component: Main,
        meta: {
            icon: 'icon_data',
            showAlways: true,
            title: '基础数据',
        },
        children: [
            // {
            //     path: 'drug-mgt',
            //     name: 'drug-mgt',
            //     meta: {
            //         icon: 'md-funnel',
            //         title: '药品管理',
            //     },
            //     component: parentView,
            //     children: [
            //
            //     ]
            // },
            {
                path: 'drug-dictionary',
                name: 'drug-dictionary',
                meta: {
                    icon: 'icon_dictionary',
                    title: '药品字典',
                },
                component: () => import('@/view/base-data/drug-mgt/drug-dictionary/drug-dictionary.vue')
            },
            {
                path: 'drug-class',
                name: 'drug-class',
                meta: {
                    icon: 'icon_classification1',
                    title: '药品分类',
                },
                // component: () => import('@/view/base-data/drug-mgt/drug-class/drug-class.vue'),
                component: parentView,
                children:[
                    {
                        path: 'class-index',
                        name: 'class-index',
                        meta: {
                            icon: 'icon_classification1',
                            index: true,
                            hideInMenu: true,
                            title: '药品分类',
                        },
                        component: () => import('@/view/base-data/drug-mgt/drug-class/drug-class.vue')
                    },
                    {
                        path: 'class-detail/:id',
                        name: 'class-detail',
                        meta: {
                            detail: true,
                            hideInMenu: true,
                            title: '分类详情',
                        },
                        component: () => import('@/view/base-data/drug-mgt/drug-class/class-detail.vue')
                    },
                ]
            },
            {
                path: 'shop-product-class',
                name: 'shop-product-class',
                meta: {
                    icon: 'icon_classification2',
                    title: '商城商品分类管理',
                },
                component: () => import('@/view/base-data/drug-mgt/shop-product-class/shop-product-class.vue')
            },
            {
                path: 'drug-varieties',
                name: 'drug-varieties',
                meta: {
                    icon: 'icon_varieties',
                    title: '药品品种',
                },
                component: () => import('@/view/base-data/drug-mgt/drug-varieties/drug-varieties.vue')
            },
            {
                path: 'compare-drug',
                name: 'compare-drug',
                meta: {
                    icon: 'icon_cloud',
                    title: '医保对码',
                },
                component: () => import('@/view/base-data/drug-mgt/compare-drug/compare-drug.vue')
            },
            {
                path: 'stock-query',
                name: 'stock-query',
                meta: {
                    icon: 'icon_stock',
                    title: '库存查询',
                },
                component: () => import('@/view/base-data/drug-mgt/stock-query/stock-query.vue')
            },
            // {
            //     path: 'hos-mgt',
            //     name: 'hos-mgt',
            //     meta: {
            //         icon: 'md-medkit',
            //         showAlways: true,
            //         title: '医疗机构管理',
            //     },
            //     component: parentView,
            //     children: [
            //
            //     ]
            // },
            {
                path: 'hos-mgt',
                name: 'hos-mgt',
                meta: {
                    icon: 'icon_information2',
                    title: '医院信息管理',
                },
                component: () => import('@/view/base-data/hos-mgt/hos-info/hos-mgt.vue')
            },
            {
                path: 'hos-dictionary',
                name: 'hos-router',
                meta: {
                    icon: 'icon_dictionary1',
                    title: '医疗机构信息字典',
                },
                component: parentView,
                children: [
                    {
                        path: 'hos-index',
                        name: 'hos-dictionary',
                        meta: {
                            icon: 'icon_dictionary1',
                            index: true,
                            hideInMenu: true,
                            title: '医疗机构信息字典',
                        },
                        component: () => import('@/view/base-data/hos-mgt/hos-dictionary/hos-dictionary.vue')
                    },
                    {
                        path: 'hos-info/:hos_id',
                        name: 'hos-info',
                        meta: {
                            detail: true,
                            hideInMenu: true,
                            title: '医疗机构详情',
                        },
                        component: () => import('@/view/base-data/hos-mgt/hos-dictionary/hos-info.vue')
                    },
                ]
            },
            // {
            //     path: 'hos-audit',
            //     name: 'hos-audit-router',
            //     meta: {
            //         icon: 'ios-medkit',
            //         title: '医疗机构审核',
            //     },
            //     component: parentView,
            //     children: [
            //         {
            //             path: 'hos-audit-index',
            //             name: 'hos-audit',
            //             meta: {
            //                 icon: 'md-funnel',
            //                 index: true,
            //                 hideInMenu: true,
            //                 title: '医疗机构审核',
            //             },
            //             component: () => import('@/view/base-data/hos-mgt/hos-audit/hos-dictionary.vue')
            //         },
            //         {
            //             path: 'hos-audit-info/:hos_id',
            //             name: 'hos-audit-info',
            //             meta: {
            //                 detail: true,
            //                 hideInMenu: true,
            //                 title: '医疗机构详情',
            //             },
            //             component: () => import('@/view/base-data/hos-mgt/hos-audit/hos-info.vue')
            //         }
            //     ]
            // },
            {
                path: 'hos-map-search',
                name: 'hos-map-search',
                meta: {
                    icon: 'icon_query1',
                    title: '医疗机构药品查询',
                },
                component: () => import('@/view/base-data/hos-mgt/hos-drug-compare/hos-drug-search.vue')
            },
            {
                path: 'hos-drug-map',
                name: 'hos-drug-map',
                meta: {
                    icon: 'icon_paircode2',
                    title: '医疗机构药品对码',
                },
                component: () => import('@/view/base-data/hos-mgt/hos-drug-compare/drug-map.vue')
            },
            // {
            //     path: 'drug-store-mgt',
            //     name: 'drug-store-mgt',
            //     meta: {
            //         icon: 'md-cart',
            //         showAlways: true,
            //         title: '药店管理',
            //     },
            //     component: parentView,
            //     children: [
            //
            //     ]
            // },
            {
                path: 'drug-store',
                name: 'drug-store',
                meta: {
                    icon: 'icon_information2',
                    title: '药店信息管理',
                },
                component: () => import('@/view/base-data/drug-store/drug-store-mgt/drug-store.vue')
            },
            {
                path: 'drug-store-dictionary',
                name: 'drug-store-router',
                meta: {
                    icon: 'icon_dictionary1',
                    title: '药店信息字典',
                },
                component: parentView,
                children: [
                    {
                        path: 'drug-store-index',
                        name: 'drug-store-dictionary',
                        meta: {
                            icon: 'icon_dictionary1',
                            index: true,
                            hideInMenu: true,
                            title: '药店信息字典',
                        },
                        component: () => import('@/view/base-data/drug-store/drug-store-dictionary/drug-store-dictionary.vue')
                    },
                    {
                        path: 'store-info/:store_id',
                        name: 'store-info',
                        meta: {
                            detail: true,
                            hideInMenu: true,
                            title: '药店详情',
                        },
                        component: () => import('@/view/base-data/drug-store/drug-store-dictionary/store-info.vue')
                    },
                    {
                        path: 'drugStore-check/:store_id',
                        name: 'drugStore-check',
                        meta: {
                            detail: true,
                            hideInMenu: true,
                            title: '药店详情',
                        },
                        component: () => import('@/view/base-data/drug-store/drug-store-dictionary/store-check.vue')
                    }
                ]
            },
            {
                path: 'drug-store-audit',
                name: 'drugStore-router',
                meta: {
                    icon: 'icon_examine',
                    title: '药店审核',
                },
                component: parentView,
                children: [
                    {
                        path: 'drugStore-index',
                        name: 'drug-store-audit',
                        meta: {
                            icon: 'icon_examine',
                            index: true,
                            hideInMenu: true,
                            title: '药店审核',
                        },
                        component: () => import('@/view/base-data/drug-store/drug-store-audit/drug-store-dictionary.vue')
                    },
                    {
                        path: 'drugStore-info/:store_id',
                        name: 'drugStore-info',
                        meta: {
                            detail: true,
                            hideInMenu: true,
                            title: '药店详情',
                        },
                        component: () => import('@/view/base-data/drug-store/drug-store-audit/store-info.vue')
                    }
                ]
            },
            {
                path: 'drugStore-drug',
                name: 'drugStore-drug',
                meta: {
                    icon: 'icon_drug',
                    title: '药店药品管理',
                },
                component: () => import('@/view/base-data/drug-store/drugStore-drug/drugStore-drug.vue')
            },
            {
                path: 'store-drug-compare',
                name: 'store-drug-compare',
                meta: {
                    icon: 'icon_cloud',
                    title: '云药房管理',
                },
                component: () => import('@/view/base-data/drug-store/store-drug-search/store-drug-search.vue')
            },
            // {
            //     path: 'pro-info-mgt',
            //     name: 'pro-info-mgt',
            //     meta: {
            //         icon: 'md-briefcase',
            //         showAlways: true,
            //         title: '专业人员信息管理',
            //     },
            //     component: parentView,
            //     children: [
            //
            //     ]
            // },
            {
                path: 'doctor-info-dic',
                name: 'doctor-info-router',
                meta: {
                    icon: 'icon_dictionary1',
                    title: '医师信息字典',
                },
                component: parentView,
                children: [
                    {
                        path: 'doctor-info-index',
                        name: 'doctor-info-dic',
                        meta: {
                            icon: 'icon_dictionary1',
                            index: true,
                            hideInMenu: true,
                            title: '医师信息字典',
                        },
                        component: () => import('@/view/base-data/doctor-mgt/doctor-info/doctor-index.vue')
                    },
                    {
                        path: 'doc-info/:doc_id',
                        name: 'doc-info',
                        meta: {
                            detail: true,
                            hideInMenu: true,
                            title: '医师详情',
                        },
                        component: () => import('@/view/base-data/doctor-mgt/doctor-info/doc-info.vue')
                    }
                ]
            },
            {
                path: 'doctor-audit',
                name: 'doctor-audit-router',
                meta: {
                    icon: 'icon_examine',
                    title: '医师审核',
                },
                component: parentView,
                children: [
                    {
                        path: 'doctor-audit-index',
                        name: 'doctor-audit',
                        meta: {
                            icon: 'icon_examine',
                            index: true,
                            hideInMenu: true,
                            title: '医师审核',
                        },
                        component: () => import('@/view/base-data/doctor-mgt/doctor-audit/doctor-index.vue')
                    },
                    {
                        path: 'doc-info-audit/:doc_id',
                        name: 'doc-info-audit',
                        meta: {
                            detail: true,
                            hideInMenu: true,
                            title: '医师详情',
                        },
                        component: () => import('@/view/base-data/doctor-mgt/doctor-audit/doc-info.vue')
                    }
                ]
            },
            {
                path: 'apothecary-info-dic',
                name: 'apothecary-info-router',
                meta: {
                    icon: 'icon_dictionary1',
                    title: '药师信息字典',
                },
                component: parentView,
                children: [
                    {
                        path: 'apothecary-info-index',
                        name: 'apothecary-info-dic',
                        meta: {
                            icon: 'icon_dictionary1',
                            index: true,
                            hideInMenu: true,
                            title: '药师信息字典',
                        },
                        component: () => import('@/view/base-data/apothecary-mgt/apothecary-info/apothecary-index.vue')
                    },
                    {
                        path: 'apo-info/:apo_id',
                        name: 'apo-info',
                        meta: {
                            detail: true,
                            hideInMenu: true,
                            title: '药师详情',
                        },
                        component: () => import('@/view/base-data/apothecary-mgt/apothecary-info/apo-info.vue')
                    }
                ]
            },
            {
                path: 'apothecary-audit',
                name: 'apothecary-audit-router',
                meta: {
                    icon: 'icon_examine',
                    title: '药师审核',
                },
                component: parentView,
                children: [
                    {
                        path: 'apothecary-audit-index',
                        name: 'apothecary-audit',
                        meta: {
                            icon: 'icon_examine',
                            index: true,
                            hideInMenu: true,
                            title: '药师审核',
                        },
                        component: () => import('@/view/base-data/apothecary-mgt/apothecary-audit/apothecary-index.vue')
                    },
                    {
                        path: 'apo-info-audit/:apo_id',
                        name: 'apo-info-audit',
                        meta: {
                            detail: true,
                            hideInMenu: true,
                            title: '药师详情',
                        },
                        component: () => import('@/view/base-data/apothecary-mgt/apothecary-audit/apo-info.vue')
                    },
                ]
            },
            // {
            //     path: 'supplier-mgt',
            //     name: 'supplier-mgt',
            //     meta: {
            //         icon: 'md-home',
            //         showAlways: true,
            //         title: '供应商管理',
            //     },
            //     component: parentView,
            //     children: [
            //
            //     ]
            // },
            {
                path: 'supplier-dic',
                name: 'supplier-router',
                meta: {
                    icon: 'icon_dictionary1',
                    title: '供应商字典',
                },
                component: parentView,
                children: [
                    {
                        path: 'supplier-index',
                        name: 'supplier-dic',
                        meta: {
                            icon: 'icon_dictionary1',
                            index: true,
                            hideInMenu: true,
                            title: '供应商字典',
                        },
                        component: () => import('@/view/base-data/supplier-mgt/supplier-dic/supplier-index.vue')
                    },
                    {
                        path: 'supplier-info/:supplier_id',
                        name: 'supplier-info',
                        meta: {
                            detail: true,
                            hideInMenu: true,
                            title: '供应商详情',
                        },
                        component: () => import('@/view/base-data/supplier-mgt/supplier-dic/supplier-info.vue')
                    }
                ]
            },
            // {
            //     path: 'supplier-audit',
            //     name: 'supplier-audit-router',
            //     meta: {
            //         icon: 'ios-home',
            //         title: '供应商审核',
            //     },
            //     component: parentView,
            //     children: [
            //         {
            //             path: 'supplier-audit-index',
            //             name: 'supplier-audit',
            //             meta: {
            //                 icon: 'md-funnel',
            //                 index: true,
            //                 hideInMenu: true,
            //                 title: '供应商审核',
            //             },
            //             component: () => import('@/view/base-data/supplier-mgt/supplier-audit/supplier-index.vue')
            //         },
            //         {
            //             path: 'supplier-info-audit/:supplier_id',
            //             name: 'supplier-info-audit',
            //             meta: {
            //                 detail: true,
            //                 hideInMenu: true,
            //                 title: '供应商详情',
            //             },
            //             component: () => import('@/view/base-data/supplier-mgt/supplier-audit/supplier-info.vue')
            //         }
            //     ]
            // },
        ]
    },
    {
        path: '/payment',
        name: 'payment',
        component: Main,
        meta: {
            title: '支付结算管理',
            showAlways: true,
            icon: 'icon_settlement',
        },
        children:[
            {
                path: 'platform-payment',
                name: 'platform-payment',
                meta: {
                    icon: 'icon_record',
                    title: '平台交易记录',
                },
                component: () => import('@/view/payment/platform-payment/platform-payment.vue')
            },
            {
                path: 'store-payment',
                name: 'store-payment',
                meta: {
                    icon: 'icon_record',
                    title: '药店交易记录',
                },
                component: () => import('@/view/payment/store-payment/store-payment.vue')
            },
            {
                path: 'hos-payment',
                name: 'hos-payment',
                meta: {
                    icon: 'icon_record',
                    title: '医院交易记录',
                },
                component: () => import('@/view/payment/hos-payment/hos-payment.vue')
            },
        ]
    },
    {
        path: '/supervision',
        name: 'supervision',
        component: Main,
        meta: {
            title: '处方监管',
            showAlways: true,
            icon: 'icon_supervise',
        },
        children:[
            {
                path: 'platform-recipe',
                name: 'platform-recipe',
                meta: {
                    icon: 'icon_query3',
                    title: '平台处方查询',
                },
                component: () => import('@/view/circulation/platform-recipe/platform-recipe.vue')
            },
            {
                path: 'hos-recipe',
                name: 'hos-recipe',
                meta: {
                    icon: 'icon_query3',
                    title: '医院处方查询',
                },
                component: () => import('@/view/circulation/hos-recipe/hos-recipe.vue')
            },
            {
                path: 'recipe-mgt',
                name: 'recipe-mgt',
                meta: {
                    icon: 'icon_query3',
                    title: '药店处方查询',
                },
                component: () => import('@/view/circulation/store-recipe/store-recipe.vue')
            },
        ]
    },
    {
        path: '/circulation',
        name: 'circulation',
        component: Main,
        meta: {
            title: '订单管理',
            showAlways: true,
            icon: 'icon_order1',
        },
        children:[
            {
                path: 'order',
                meta: {icon: 'icon_order1', title: '订单管理'},
                name: 'order-router',
                component: parentView,
                children: [
                    {
                        path: 'order-index',
                        name: 'order',
                        meta: {
                            index: true,
                            hideInMenu: true,
                            title: '订单管理',
                        },
                        component: () => import('@/view/circulation/order/order-index.vue')
                    },
                    {
                        path: 'order-info/:order_id',
                        name: 'order-info',
                        meta: {
                            detail: true,
                            hideInMenu: true,
                            title: '订单详情',
                        },
                        component: () => import('@/view/circulation/order/order-info.vue')
                    }
                ]
            },
            {
                path: 'store-order',
                meta: {icon: 'icon_order1', title: '药店订单管理'},
                name: 'store-order-router',
                component: parentView,
                children: [
                    {
                        path: 'store-order-index',
                        name: 'store-order',
                        meta: {
                            index: true,
                            hideInMenu: true,
                            title: '药店订单管理',
                        },
                        component: () => import('@/view/circulation/store-order/order-index.vue')
                    },
                    {
                        path: 'store-order-info/:order_id',
                        name: 'store-order-info',
                        meta: {
                            detail: true,
                            hideInMenu: true,
                            title: '订单详情',
                        },
                        component: () => import('@/view/circulation/store-order/order-info.vue')
                    }
                ]
            },
        ]
    },
    {
        path: '/patient',
        name: 'patient',
        component: Main,
        meta: {
            title: '患者管理',
            showAlways: true,
            icon: 'icon_patient',
        },
        children:[
            {
                path: 'patient-dic',
                meta: {icon: 'icon_dictionary1', title: '患者信息字典'},
                name: 'patient-router',
                component: parentView,
                children: [
                    {
                        path: 'patient-index',
                        name: 'patient-dic',
                        meta: {
                            icon: 'icon_dictionary1',
                            index: true,
                            // hideInMenu: true,
                            title: '患者信息字典',
                        },
                        component: () => import('@/view/patient/patient-dic/patient-index.vue')
                    },
                    {
                        path: 'patient-info/:patient_id',
                        name: 'patient-info',
                        meta: {
                            detail: true,
                            hideInMenu: true,
                            title: '患者详情',
                        },
                        component: () => import('@/view/patient/patient-dic/patient-info.vue')
                    }
                ]
            },
        ]
    },
    {
        path: '/operate',
        name: 'operate',
        component: Main,
        meta: {
            title: '运营管理',
            showAlways: true,
            icon: 'icon_operate',
        },
        children: [
            {
                path: 'article-class',
                meta: {icon: 'icon_classification3', title: '分类管理'},
                name: 'article-class',
                component: () => import('@/view/operate/article-class/article-class.vue')
            },
            {
                path: 'information',
                meta: {icon: 'icon_information', title: '资讯管理'},
                name: 'information-router',
                component: parentView,
                children: [
                    {
                        path: 'information-index',
                        name: 'information',
                        meta: {
                            icon: 'icon_information',
                            index: true,
                            hideInMenu: true,
                            title: '资讯管理',
                        },
                        component: () => import('@/view/operate/information/information-index.vue')
                    },
                    {
                        path: 'information-detail/:information_id',
                        name: 'information-detail',
                        meta: {
                            detail: true,
                            hideInMenu: true,
                            title: '资讯详情',
                        },
                        component: () => import('@/view/operate/information/information-info.vue')
                    }
                ]
            },
            {
                path: 'information-audit',
                meta: {icon: 'icon_examine1', title: '资讯审核'},
                name: 'information-audit-router',
                component: parentView,
                children: [
                    {
                        path: 'information-audit-index',
                        name: 'information-audit',
                        meta: {
                            icon: 'icon_examine1',
                            index: true,
                            hideInMenu: true,
                            title: '资讯审核',
                        },
                        component: () => import('@/view/operate/information-audit/information-index.vue')
                    },
                    {
                        path: 'information-info/:information_id',
                        name: 'information-info',
                        meta: {
                            detail: true,
                            hideInMenu: true,
                            title: '资讯详情',
                        },
                        component: () => import('@/view/operate/information-audit/information-info.vue')
                    }
                ]
            },
            {
                path: 'notice',
                meta: {icon: 'icon_notice', title: '公告管理'},
                name: 'notice-router',
                component: parentView,
                children: [
                    {
                        path: 'notice-index',
                        name: 'notice',
                        meta: {
                            icon: 'icon_notice',
                            index: true,
                            hideInMenu: true,
                            title: '公告管理',
                        },
                        component: () => import('@/view/operate/notice/notice.vue')
                    },
                    {
                        path: 'notice-info/:notice_id',
                        name: 'notice-info',
                        meta: {
                            detail: true,
                            hideInMenu: true,
                            title: '公告详情',
                        },
                        component: () => import('@/view/operate/notice/notice-info.vue')
                    }
                ]
            },
            {
                path: 'notice-audit',
                meta: {icon: 'icon_examine2', title: '公告审核'},
                name: 'notice-audit-router',
                component: parentView,
                children: [
                    {
                        path: 'notice-audit-index',
                        name: 'notice-audit',
                        meta: {
                            icon: 'icon_examine2',
                            index: true,
                            hideInMenu: true,
                            title: '公告审核',
                        },
                        component: () => import('@/view/operate/notice-audit/notice.vue')
                    },
                    {
                        path: 'notice-audit-info/:notice_id',
                        name: 'notice-audit-info',
                        meta: {
                            detail: true,
                            hideInMenu: true,
                            title: '公告详情',
                        },
                        component: () => import('@/view/operate/notice-audit/notice-info.vue')
                    }
                ]
            },
            {
                path: 'active',
                meta: {icon: 'icon_activity', title: '活动管理'},
                name: 'active-router',
                component: parentView,
                children: [
                    {
                        path: 'active-index',
                        name: 'active',
                        meta: {
                            icon: 'icon_activity',
                            index: true,
                            hideInMenu: true,
                            title: '活动管理',
                        },
                        component: () => import('@/view/operate/active/active.vue')
                    },
                    {
                        path: 'active-info/:active_id',
                        name: 'active-info',
                        meta: {
                            detail: true,
                            hideInMenu: true,
                            title: '活动详情',
                        },
                        component: () => import('@/view/operate/active/active-info.vue')
                    },
                    {
                        path: 'check-active/:active_id',
                        name: 'check-active',
                        meta: {
                            detail: true,
                            hideInMenu: true,
                            title: '活动详情',
                        },
                        component: () => import('@/view/operate/active/check_active.vue')
                    }
                ]
            },
            {
                path: 'active-audit',
                meta: {icon: 'icon_examine3', title: '活动审核'},
                name: 'active-audit-router',
                component: parentView,
                children: [
                    {
                        path: 'active-audit-index',
                        name: 'active-audit',
                        meta: {
                            icon: 'icon_examine3',
                            index: true,
                            hideInMenu: true,
                            title: '活动审核',
                        },
                        component: () => import('@/view/operate/active-audit/active.vue')
                    },
                    {
                        path: 'active-audit-info/:active_id',
                        name: 'active-audit-info',
                        meta: {
                            detail: true,
                            hideInMenu: true,
                            title: '活动详情',
                        },
                        component: () => import('@/view/operate/active-audit/active-info.vue')
                    }
                ]
            },
            {
                path: 'banner',
                meta: {icon: 'icon_chart', title: '轮播图管理'},
                name: 'banner',
                component: () => import('@/view/operate/banner/banner.vue')
            },
            {
                path: 'banner-audit',
                meta: {icon: 'icon_examine4', title: '轮播图审核'},
                name: 'banner-audit',
                component: () => import('@/view/operate/banner-audit/banner-audit.vue')
            },
            {
                path: 'feedback',
                meta: {icon: 'icon_problem', title: '问题反馈管理'},
                name: 'feedback',
                component: () => import('@/view/operate/feedback/feedback.vue')
            },
        ]
    },
    {
        path: '/online',
        name: 'online',
        component: Main,
        meta: {
            title: '在线咨询',
            showAlways: true,
            icon: 'icon_consultation',
        },
        children: [
            {
                path: 'advisory',
                meta: {icon: 'icon_Interrogation', title: '问诊咨询'},
                name: 'advisory',
                component: () => import('@/view/online/advisory/advisory.vue')
            },
            {
                path: 'support',
                meta: {icon: 'icon_problem', title: '客服咨询'},
                name: 'support',
                component: () => import('@/view/online/support/support.vue')
            },
        ]
    },
    // {
    //     path: '/sys',
    //     name: 'sys',
    //     component: Main,
    //     meta: {
    //         title: '系统设置',
    //         icon: 'md-menu',
    //         showAlways:true
    //     },
    //     children: [
    //         {
    //             path: 'account',
    //             meta: {icon: 'md-settings', title: '账户设置'},
    //             name: 'account',
    //             component: () => import('@/view/sys/account/account.vue')
    //         },
    //     ]
    // },
    // {
    //     path: '/test',
    //     name: 'test',
    //     component: Main,
    //     meta: {
    //         title: '测试',
    //     },
    //     children: [
    //         {
    //             path: 'tese-page',
    //             meta: {icon: 'md-flower', title: '测试'},
    //             name: 'tese-page',
    //             component: () => import('@/view/test/test-page.vue')
    //         },
    //     ]
    // },
    {
        path: '/401',
        name: 'error_401',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/view/error-page/401.vue')
    },
    {
        path: '/500',
        name: 'error_500',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/view/error-page/500.vue')
    },
    {
        path: '*',
        name: 'error_404',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/view/error-page/404.vue')
    },
    {
        path: '/403',
        name: 'error_403',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/view/error-page/403.vue')
    },
]
