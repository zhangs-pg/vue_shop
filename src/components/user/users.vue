<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="7">
                    <!-- 搜索框 -->
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="getUserList"
                        ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
                    <!-- 添加用户对话框 -->
                    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addDialogClosed">
                    <el-form :model="addForm" status-icon :rules="addFormRules" ref="addFormRef" label-width="70px">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="addForm.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="addForm.password"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="addForm.email"></el-input>
                        </el-form-item>
                        <el-form-item label="手机" prop="mobile">
                            <el-input v-model="addForm.mobile"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="addUser">确 定</el-button>
                    </span>
                    </el-dialog>
                    <!-- 修改用户对话框 -->
                    <el-dialog
                        title="修改用户"
                        :visible.sync="editDialogVisible"
                        width="50%"
                        @close="editDialogClosed">
                        <el-form :model="editForm" status-icon :rules="editFormRules" ref="editFormRef" label-width="70px">
                            <el-form-item label="用户名" prop="username">
                                <el-input v-model="editForm.username" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱" prop="email">
                                <el-input v-model="editForm.email"></el-input>
                            </el-form-item>
                            <el-form-item label="手机" prop="mobile">
                                <el-input v-model="editForm.mobile"></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="editDialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="editUser">确 定</el-button>
                        </span>
                    </el-dialog>
                </el-col>
            </el-row>

            <el-table :data="userList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                    </el-switch>
                </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                <template slot-scope="scope">
                    <el-row>
                        <el-tooltip content="编辑" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
                        </el-tooltip>
                    </el-row>
                </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <span class="demonstration"></span>
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.currentpage"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法邮箱'))
    }
    var checkTel = (rule, value, cb) => {
      const regTel = /^[1][3,4,5,7,8][0-9]{9}$/
      if (regTel.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法手机号'))
    }
    return {
      queryInfo: {
        query: '',
        currentpage: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度3~10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '密码长度6~10个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkTel, trigger: 'blur' }
        ]
      },
      editFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度3~10个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkTel, trigger: 'blur' }
        ]
      },
      editForm: {}
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('/get/users/test', {
        params: { offset: this.queryInfo.currentpage, limit: this.queryInfo.pagesize, name: this.queryInfo.query }
      })
      this.userList = res.data.userList
      if (this.queryInfo.query !== '') {
        this.total = this.userList.length
      } else {
        this.total = res.data.total
      }
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.currentpage = newPage
      this.getUserList()
    },
    userStateChanged (userinfo) {
      console.log(userinfo)
      //   调用接口修改
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    addUser () {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
        //  this.$http.post(this.addForm)
          this.$message('添加用户成功')
          this.dialogVisible = false
          this.getUserList()
        }
      })
    },
    editUser () {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          console.log(this.editForm.email, this.editForm.mobile, this.editForm)
          //  this.$http.post(this.addForm)
          this.$message('修改用户成功')
          this.editDialogVisible = false
          this.getUserList()
        }
      })
    },
    showEditDialog (id) {
      for (var user in this.userList) {
        if (this.userList[user].id === id) {
          this.editForm = this.userList[user]
        }
      }
      this.editDialogVisible = true
    },
    async deleteUser (id) {
      const res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).catch(err => err)
      if (res !== 'confirm') {
        return this.$message.info('已取消')
      }
      //   this.$http.delete
      this.$message.success('已删除')
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
    margin-bottom: 15px;
    font-size: 12px;
}

.el-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}

.el-table {
    margin-top: 15px;
    font-size: 12px;
}

.el-pagination {
    margin-top: 15px;
    font-size:"12px !important";
}
</style>
