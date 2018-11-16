# mac生成ssh key

## 全局修改git的用户名和邮箱

git config --global user.name "xxxxx" 

git config --global user.email xxxxxx@qq.com

## Mac显示隐藏系统文件

方法一：（快捷键）

      打开Finder，同时按下三个组合键：Shift + Command + . 

方法二：（终端操作，要重启Finder，没方法一快捷）

      显示：defaults write com.apple.finder AppleShowAllFiles -bool true 

      隐藏：defaults write com.apple.finder AppleShowAllFiles -bool false

## 生存密钥

      输入指令：ssh-keygen -t rsa -C "xxxxxxx@qq.com"，提示输入保存密钥路径，直接回车即可（三次默认回车）。

注：后面是自己的GitHub邮箱

## 复制公钥内容

终端连续输入指令:

 1.  cd ~
 2.  cd ./.ssh
 3.  vim ./id_rsa.pub

或者 open ~/.ssh  将id_rsa.pub 拖到编辑器打开 