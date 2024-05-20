package com.example.demo.controller;



import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.example.demo.jpa.AccountRepo2;
import com.example.demo.jpa.EmployeeRepo;
import com.example.demo.jpa.ManagerRepo;
import com.example.demo.jpa.MemberRepo;
import com.example.demo.vo.ManagerVO;
import com.example.demo.vo.MemberVO;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
public class MainController {
	
	@Autowired
	MemberRepo memberRepo;
	@Autowired
	ManagerRepo managerRepo;
	@Autowired
	EmployeeRepo employeRepo;
	@Autowired
	AccountRepo2 accountRepo2;
	
	
	
	
	@RequestMapping(value="/")
	public ModelAndView index() {
		ModelAndView mav = new ModelAndView();
		mav.setViewName("index");
		return mav;
	}
	@RequestMapping(value="/register")
	public ModelAndView register() {
		ModelAndView mav = new ModelAndView();
		List<Integer> employeeNum = employeRepo.selectEnployeeNum();
//		System.out.println("employeeNum >>> " + employeeNum);
		mav.addObject("employeeNum", employeeNum);
		mav.setViewName("member/register");
		return mav;
	}
	@RequestMapping(value="/register_Account")
	public ModelAndView registerAccount(MemberVO member) {
		ModelAndView mav = new ModelAndView();
		memberRepo.save(member);
//		System.out.println("member >> " + member);
		mav.setViewName("forward:/");
		return mav;
	}
	@RequestMapping(value="/manager_Account")
	public ModelAndView manager_Account(ManagerVO manager, HttpSession session) {
		
		ModelAndView mav = new ModelAndView();

		try {
			managerRepo.save(manager);
			mav.setViewName("forward:/");
			return mav;
			
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("부모 키가 없습니다.");
			mav.setViewName("member/register");
			return mav;
		}
	}
	@RequestMapping(value="/login")
	public ModelAndView login() {
		ModelAndView mav = new ModelAndView();
		List<String> memberId = new ArrayList<>();
		List<String> memberPw = new ArrayList<>();
		List<String> managerId = new ArrayList<>();
		List<String> managerPw = new ArrayList<>();
		
		List<Map<String,String>> memberidpw = memberRepo.selectMemberIdPw();
		List<Map<String,String>> manageridpw = managerRepo.selectManagerIdPw();
		
//		System.out.println("여기다 >>> " + manageridpw.get(0).keySet());
		
		for(Map<String, String> a : memberidpw) {
			 memberId.add(a.get("ID").toString());
			 memberPw.add(a.get("PW").toString());
		}
		
		for(Map<String, String> a : manageridpw) {
			managerId.add(a.get("MANAGER_ID").toString());
			managerPw.add(a.get("MANAGER_PW").toString());
		}
		
		System.out.println(" >>> " + managerId.toString());
		System.out.println(" >>> " + managerPw.toString());
		mav.addObject("memberId", memberId);
		mav.addObject("memberPw", memberPw);
		mav.addObject("managerId", managerId);
		mav.addObject("managerPw", managerPw);
		
		mav.setViewName("login/login");
		return mav;
	}
	@RequestMapping(value="/loginController")
	public ModelAndView loginControl(MemberVO mem, HttpSession session) {
		ModelAndView mav = new ModelAndView();
		System.out.println(">>>>>>>>>>>>");
		System.out.println("id: "+ mem.getId() + "    pw: "+mem.getPw());
		
		MemberVO dbMem = null;
		
		String id = mem.getId();
		String pw = mem.getPw();
		try {
			dbMem = memberRepo.getById(id);
			System.out.println("DB: >>"+ dbMem);
			System.out.println("로그인 완료");
			session.setAttribute("login", dbMem);
			mav.setViewName("forward:/");
			
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("로그인 실패");
			mav.setViewName("forward:/");
		}
		return mav;
	}
	@RequestMapping(value="mangerLoginController")
	public ModelAndView mangerLoginController(ManagerVO manager, HttpSession session) {
		ModelAndView mav = new ModelAndView();
		System.out.println(">>>>>>>>>>>>");
		System.out.println("id: "+ manager.getManager_id() + "    pw: "+manager.getManager_pw());
		
		ManagerVO dbManager = null;
		
		String id = manager.getManager_id();
		String pw = manager.getManager_pw();
		try {
			dbManager = managerRepo.getById(id);
			System.out.println("DB: >>"+ dbManager);
			System.out.println("로그인 완료");
			session.setAttribute("managerLogin", dbManager);
			mav.setViewName("admin/managePage");
			
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("로그인 실패");
			mav.setViewName("forward:/");
		}
		return mav;
	}
	@RequestMapping(value="/logout")
	public ModelAndView logout(HttpSession session) {
			ModelAndView mav = new ModelAndView();
			session.removeAttribute("login");
			mav.setViewName("forward:/");
			return mav;
	}
	@RequestMapping(value="/managerLogout")
	public ModelAndView managerLogout(HttpSession session) {
		ModelAndView mav = new ModelAndView();
		session.removeAttribute("managerLogin");
		mav.setViewName("forward:/");
		return mav;
	}
	@RequestMapping(value="/accountSearch")
	public ModelAndView accountSearch(HttpServletRequest request) {
		ModelAndView mav = new ModelAndView();
		String id = request.getParameter("id");
		List<Map<String, Integer>> accountList = accountRepo2.selectAccount(id);
		List<String> accountTotal = new ArrayList<>();
		List<String> accountNum = new ArrayList<>();
		for(Map<String, Integer> a : accountList) {
			accountNum.add(String.valueOf(a.get("ACCOUNT_NUM")));
			accountTotal.add(a.get("TOTAL").toString());
		}
		
		mav.addObject("accountNum",accountNum);
		mav.addObject("accountTotal", accountTotal);
		
		mav.setViewName("account/searchAccount");
		return mav;
	}
}
