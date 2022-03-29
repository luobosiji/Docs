# Git 使用手册
> 推荐学习地址
> [一个git游戏](https://learngitbranching.js.org/) show solution
> 
> [文档](https://git-scm.com/book/zh/v2)

## 设置git信息
- `git config --global user.name "庞军豪"` 
- `git config --global user.email "junhaopang@caixin.com"`
- `git config --local user.name "庞军豪"`

## SSH免密登录
- `cd ~/.ssh`
  - id_rsa (私钥)
  - id_rsa.pub（公钥）
  - 新建一个新的SSH key
    - `ssh-keygen -t rsa -C "xx@xx.com"`
    -  id_rsa.pub 拷贝到 github  新建的 SSH keys 中
    -  修改私钥密码 
       -  切换到~/.ssh目录：cd ~/.ssh，然后执行ssh-keygen -p -f your_key_filename。然后会提示输入旧密码、然后再输入两次新密码，就修改成功了，如果没有-f your_key_filename，则默认修改的密钥文件是id_rsa。注意：直接回车代表密码为空。
- 修改git远程仓库
  - `git remote rm origin`  删除
  - `git remote add origin [url]`  添加
  - `git push --set-upstream origin master`  关联分支

## 基本用法
- `git init` 初始化
- `git remote add origin https://github.com/luobosiji/Docs.git` 添加远程git地址
- `git commit` 提交
- `git push -u origin master` 推送并关联远程分支
- `git branch newBranch` 创建newBranch分支
  - `git branch`查看当前分支
  - `git branch -a` 查看所有分支
  - `git branch -d name` 删除本地分支
  - `git branch origin :name` 删除远程分支
  - `git branch -m old new` 重命名分支
- `git checkout -b bugFix` 创建并切换到bugFix分支
- `git merge bugFix` 当前分支(master) 合并 bugFix分支的内容
  - `git checkout bugFix; git merge master` 
  - 此时因为 master继承自bugFix 所以 git什么都不用做，只是把bugFix移动到master指向的那个提交记录
- `git rebase master`  把当前工作的分支内容合并到master(当前分支 变成最新)
  - rebase的优势 可以创造 更线性的提交历史
  - `git checkout master; git merge bugFix` 切换到 master 把他rebase到bugFix上
  - `git rebase one two` 把 two rebase 到 one 上
- `git branch -d hotfix` 删除hotfix分支

## 日志
- `git log` 查看日志
  - `git log --pretty=oneline` 以行的形式展示日志
- `git reflog` 查看所有分支的所有操作记录（包括被删除的commit记录和reset的操作）

## HEAD
> 指向当前分支上最后一次提交记录，通常情况下指向分支名。
> 分离的HEAD 指向某个具体提交记录而不是分支名
- `git checkout xxxx` HEAD 指向xxxx（通过哈希值指定提交记录 可通过`git log`查看） 提交记录
- 相对引用
  - `^` 向上移动1个提交记录
    - `git checkout master^` 切换到master的父节点
    - `git checkout HEAD^` 切换到当前引用的父节点
  - `~n` 向上移动n个提交记录
  - `^2` 选择另一个父提交
  - `git checkout HEAD~^2~2` 支持链式操作
- 强制修改分支位置
  - `git branch -f master HEAD~3` 将master分支强制指向HEAD 的第三个父提交
  - `git branch -f master xxxx` 将master分支强制指向xxxx 提交

## 撤销变更
- `reset` 适用于本地代码库（移动 HEAD 的指向）
  - [原理参考](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E9%87%8D%E7%BD%AE%E6%8F%AD%E5%AF%86#_git_reset)
  - `git reset HEAD~1`当前分支移动到上一次提交
  - `git reset xxxxxx` 当前分支移动到某次提交
- `git revert HEAD` 适用于远程
  - 本质上是基于HEAD的一次新的提交，状态与HEAD^是相同的
  - `revert` 之后 需要推送到远程仓库与别人分享

## 整理提交记录
- `git cherry-pick xxx xxx ...` 把一个或多个 xxx提交 合并到当前分支

## 交互式rebase
>强调，rebase 改动了所有在列表中的提交的 SHA-1 校验和，所以要确保列表中的提交还没有推送到共享仓库中。
- `git rebase --interactive` 
  - 简写为`git rebase -i HEAD~4`
  - 可以修改提交信息
    - `pick` 改为 `edit`
    - `git commit --amend`
    - `git rebase --continue` 最后执行
  - 可以调整提交记录的顺序、删除不想要的提交（直接调整顺序或者删除）
  - 合并提交（压缩提交）
    - 保留最早的一个 `pick` 其它都修改为`squash`
  - 拆分提交（实际上将会撤消那次提交并将修改的文件未暂存）
    - `pick` 改为 `edit`
    - `git reset HEAD^`做一次针对那个提交的混合重置
    - `git add README`
    - `git commit -m 'updated README formatting'`
    - `...重复多次提交`
    - `git rebase --continue` 最后执行

## 修改最后一次提交commit 信息 或者通过添加、移除或修改文件来更改提交实际的内容( 替换 掉旧有的最后一次提交)
>它类似于一个小的变基——如果已经推送了最后一次提交就不要修正它。
- `git commit --amend -am 'edit commit message'`
- `git commit --amend --no-edit`
  - 如果你的修补是琐碎的那么之前的提交信息不必修改，你只需作出更改，暂存它们，然后通过以上命令避免不必要的编辑器环节

## Tag
- `git tag v1 xxx`
  - 如果不指定xxx 则默认使用HEAD指向的位置
- `git checkout tag` 这时 HEAD 处于分离状态
- `git describe <ref>` 描述离你最近的tag
  - `v1_2_gC2`
    - `<tag>_<numCommits>_g<hash>`
      - tag 标签名称
      - numCommits 相差几个提交记录
      - hash 给定的ref 的哈希值（`git describe master`这里是master分支的）
  - `git bisect` 一个查找产生 Bug 的提交记录的指令

## 远程
> o 代表 origin 表示远程
- 拉取
  - `git pull` 拉取远程数据（先拉取 在合并）
    - `git fetch` 拉取远程数据到本地远程分支
    - `git merge o/master` 合并
    - `git push` 会把每一步骤都推送到远程
  - `git pull --rebase`
    - `git fetch` 
    - `git rebase o/master`
    - `git push` 会把合并后的提交推送到远程
  - `git pull origin master` 会将远程master合并到本地当前的检出位置（无论当前检出的位置是哪）
  - `git pull origin master:foo`
    - 拉取远程master分支到本地foo分支
    - 在merge到本地当前检出的分支
- 设定跟踪远程分支
  - `git checkout -b xxx o/xxx` 从远程某个分支 检出一个新的分支
  - `git branch -u o/xxx xxx` 设置xxx分支 跟踪o/xxx远程分支（如果在当前分支可省略 xxx）
- `git push <remote> <place>` 指定分支推送到指定远程
  - `git push origin <place>`
    - 切换到place分支，提交到远程仓库origin 的 place分支（这里同时指定了来源和目标都是place分支）
  - 当HEAD分离状态时 必须指定参数，否则命令失败（因为HEAD 没有跟踪任何分支）
  - 这里指定了git需要的信息，所以它会忽略我们所检出的分支的属性
  - `git push origin <source>:<destination>` 同时指定来源和目标
    - source 是 Git 能识别的位置(refspec)
    - `git push origin foo^:master`
    - 如果推送的目的分支不存在 则会在远程中自动创建分支
    - `git push origin :foo` 给 source 传空值 ，删除远程仓库中的 foo 分支
- `git fetch origin foo` 
  - 拉取远程的foo分支的提交到本地foo上
  - `git fetch origin <source>:<destination>` 跟push 相同 但是方向相反
  - `git fetch` 没有参数时 会下载各个远程分支的内容
  - `git fetch origin :foo` 给 source 传空值 ，在本地仓库中创建 foo 分支



## 锁定master分支（远程服务器拒绝 Remote Rejected）
>不允许直接修改master分支，必须使用pull request来更新这个分支


# 揭秘重置
>Git 作为一个系统，是以它的一般操作来管理并操纵这三棵树的：
- HEAD 上一次提交的快照，下一次提交的父结点
- Index 预期的下一次提交的快照（暂存区）
- Working Directory 沙盒 （工作环境）

>经典的 Git 工作流程是通过操纵这三个区域来以更加连续的状态记录项目快照的
- HEAD --(checkout the project)--> 
- Working Directory --(Stage Files)--> 
- Index --(commit)--> HEAD

### 解析工作流程
- 默认创建文件 在working 中
- 通过 git add 将其复制到索引index中
- 通过 git commit 去的索引中的内容并保存为一个永久快照，创建一个指向该快照的提交对象
- 此时 git status 没有任何改动 因为三棵树完全相同

### 重置
>reset 移动的是HEAD指向的分支
>checkout 移动的是HEAD本身
1. 移动HEAD`git reset --soft HEAD~`
  - 其实就是把该分支移动回原来的位置，而不会改变索引和工作目录。
  - 它本质上是撤销了上一次 git commit 命令
  - 这个时候 分支指向Index 现在可以 再次 git commit 来修改最后一次提交
  - 若指定了 --soft，则到此停止
2. 更新索引(--mixed)
  - `git reset --mixed HEAD~` 这是 reset的默认行为
  - 这时 回到了 git add 和git commit 之前（当前的改动 还会保留）
3. 更新工作目录（--hard）
  - 撤销工作中的左右改动（如果未提交 则无法找回）
  - 若指定 --hard，则到此停止
  - 它强制覆盖了工作目录中的文件

### 通过路径来重置
- `git reset file.js`
  - 本质上只是将 file.js 从 HEAD 复制到索引(index)中。
  - 有取消暂存的效果
  - `git reset eb43bf file.js`

### 压缩提交
- `git reset --soft HEAD~2`
  - 将 HEAD 分支移动到一个旧一点的提交上（即你想要保留的最近的提交）
  - 再次运行 git commit