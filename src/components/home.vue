<template>
    <el-container class="home-container">
        <!-- 头 -->
        <el-header>
            <div>
                <img src="" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
                        <!-- 一级菜单模板 -->
                        <template slot="title">
                        <!-- 图标 -->
                        <i :class="iconsObj[item.id]"></i>
                        <!-- 文本 -->
                        <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/' + subitem.path" v-for="subitem in item.children" :key="subitem.id" @click="saveNavState('/' + subitem.path)">
                        <!-- 二级菜单模板 -->
                        <template slot="title">
                        <!-- 图标 -->
                        <i class="el-icon-menu"></i>
                        <!-- 文本 -->
                        <span>{{subitem.authName}}</span>
                        </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
  data () {
    return {
      menulist: [
        { id: 1, authName: '用户管理', children: [{ id: 11, authName: '用户列表', path: 'users' }] },
        { id: 2, authName: '权限管理', children: [{ id: 21, authName: '角色列表', path: 'roles' }, { id: 22, authName: '权限列表' }] },
        { id: 3, authName: '商品管理', children: [{ id: 31, authName: '商品列表' }, { id: 32, authName: '分类参数' }, { id: 33, authName: '商品分类' }] },
        { id: 4, authName: '订单管理', children: [{ id: 41, authName: '订单列表' }] },
        { id: 5, authName: '数据统计', children: [{ id: 51, authName: '用户列表', path: 'reports' }] }
      ],
      iconsObj: {
        1: 'el-icon-s-custom',
        2: 'el-icon-view',
        3: 'el-icon-s-goods',
        4: 'el-icon-s-order',
        5: 'el-icon-s-data'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created () {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container{
    height: 100%;
}

.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0%;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      span {
          margin-left: 15px;
      }
    }
}

.el-aside {
    background-color: #333744;
    .el-menu{
        border-right: none;
    }
}

.el-main {
    background-color: #EAEDF1;
}

.toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}

</style>
